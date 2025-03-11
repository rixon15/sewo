<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HotelController extends Controller
{
    /**
     * Display a list of the resource.
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {

        $limit = $request->query('limit', 1);


        $hotels = Hotel::query()->with(['images', 'mainImage'])->paginate($limit);

        if ($hotels->isNotEmpty()) {
            return response()->json([
                'message' => 'Hotels retrieved successfully',
                'data' => $hotels
            ], 201);
        } else {
            return response()->json([
                'message' => 'Hotel not found in the database'
            ], 401);
        }
    }

    public function indexByCategory(Request $request): JsonResponse
    {
        $category = $request->query('category', 'Popular');
        $limit = $request->query('limit', 4);

        switch ($category) {
            case 'Popular':

                $hotels = Hotel::query()
                    ->withCount('bookings')
                    ->with(['images', 'mainImage'])
                    ->orderByDesc('bookings_count')
                    ->paginate($limit);

                break;
            case 'Recommended':

                $hotels = Hotel::query()
                    ->withAvg('reviews as average_rating', 'rating')
                    ->with(['images', 'mainImage'])
                    ->orderByDesc('average_rating')
                    ->paginate($limit);

                break;
            case 'Nearest':
                //Todo: Implement geolocation sorting
                $hotels = Hotel::query()
                    ->with(['images', 'mainImage'])
                    ->inRandomOrder()
                    ->paginate($limit);

                break;
            default:
                return response()->json([
                    'message' => 'Invalid category'
                ], 400);
        }

        if ($hotels->isNotEmpty()) {
            return response()->json([
                'message' => 'Hotels retrieved successfully',
                'data' => $hotels
            ], 200);

        }

        return response()->json([
            'message' => 'Hotels not found for this category'
        ], 404);
    }


    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip' => 'required|string',
            'description' => 'required|string|max:255',
            'star_rating' => 'required|integer|min:1|max:5',
            'beds' => 'required|integer|min:1',
            'baths' => 'required|integer|min:1',
            'area' => 'required|integer|min:5',
            "kitchen" => 'required|boolean',
            "balcony" => 'required|boolean',
            "wifi" => 'required|boolean',
            "parking_area" => 'required|boolean',
            "smoking_area" => 'required|boolean',
            'price' => 'required|integer|min:100',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized request!'
            ], 401);
        }

        $hotel = Hotel::query()
            ->where('name', $request->name)
            ->where('address', $request->address)
            ->where('city', $request->city)
            ->where('state', $request->state)
            ->where('zip', $request->zip)
            ->first();

        if ($hotel) {
            return response()->json([
                'message' => 'Hotel already exists in the database'
            ], 403);
        }


        $newHotel = new Hotel($validatedData);
        $newHotel->user_id = $user->id;
        $newHotel->save();

        return response()->json([
            'message' => 'Hotel successfully added to the database',
            'data' => $newHotel
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Hotel $hotel): JsonResponse
    {
        try {
            // Combine related loads into a single query
            $hotel->load([
                'images:id,hotel_id,url,is_main',  
                'mainImage:id,hotel_id,url',       
                'reviews' => function ($query) {
                    $query->select('id', 'hotel_id', 'user_id', 'rating', 'review_text', 'created_at')
                        ->latest()
                        ->with(['user:id,name']);
                },
                'user' => function ($query) {
                    $query->select('id', 'name', 'email')
                        ->withCount('hotel');
                }
            ])->loadAvg('reviews', 'rating');

            return response()->json([
                'message' => 'Hotel retrieved successfully',
                'data' => $hotel
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'message' => 'Hotel not found in the database!',
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Hotel $hotel, Request $request): JsonResponse
    {

        $validatedData = $request->validate([
            'name' => 'string|max:255',
            'address' => 'string',
            'city' => 'string',
            'state' => 'string',
            'zip' => 'string',
            'description' => 'string|max:255',
            'star_rating' => 'integer|min:1|max:5',
            'beds' => 'integer|min:1',
            'baths' => 'integer|min:1',
            'area' => 'integer|min:5',
            "kitchen" => 'boolean',
            "balcony" => 'boolean',
            "wifi" => 'boolean',
            "parking_area" => 'boolean',
            "smoking_area" => 'boolean',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized request!'
            ], 401);
        }

        try {

            if ($hotel->user_id != $user->id) {
                return response()->json([
                    'message' => 'Unauthorized request!',
                ], 401);
            }

            $hotel->update($validatedData);
            return response()->json([
                'message' => 'Hotel updated successfully',
                'data' => $hotel
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'message' => 'Hotel not found in the database!'
            ], 404);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hotel $hotel): JsonResponse
    {

        $user = Auth::user();


        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized request!'
            ], 401);
        }

        try {

            if ($hotel->user_id != $user->id) {
                return response()->json([
                    'message' => 'Unauthorized request'
                ], 401);
            }

            $hotel->delete();

            return response()->json([
                'message' => 'Hotel deleted successfully'
            ]);

        } catch (ModelNotFoundException) {
            return response()->json([
                'message' => 'Hotel not found in the database'
            ], 404);
        }

    }
}
