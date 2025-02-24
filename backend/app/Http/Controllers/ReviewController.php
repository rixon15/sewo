<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $limit = $request->query('limi', 1);

        $reviews = Review::query()->paginate($limit);

        if ($reviews->isEmpty()) {
            return response()->json([
                'message' => 'No reviews in the database'
            ], 404);
        }

        return response()->json([
            'message' => 'Reviews retrieved successfully',
            'data' => $reviews
        ]);

    }

    public function showByHotelID(Request $request)
    {

        $hotel_id = $request->query('hotel_id', null);
        $limit = $request->query('limit', 1);

        if ($hotel_id == null) {
            return response()->json([
                'message' => 'Invalid query'
            ]);
        }

        $review = Review::query()->where('hotel_id', $hotel_id)->paginate($limit);

        if($review->isEmpty()) {
            return  response()->json([
                'message' => 'Reviews '
            ]);
        }

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'review_text' => 'required|string|max:255',
            'rating' => 'required|max:5|min:1',
            'hotel_id' => 'required|integer'
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized request'
            ], 403);
        }

        $newReview = new Review($validatedData);
        $newReview->user_id = $user->id;
        $newReview->save();

        return response()->json([
            'message' => 'Review created successfully'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {

        $user = Auth::user();

        if (!$user || $review->user_id != $user->id) {
            return response()->json([
                'message' => 'Unauthorized request'
            ], 403);
        }

        try {

            return response()->json([
                'message' => 'Review retrieved successfully',
                'data' => $review
            ]);

        } catch (ModelNotFoundException) {

            return response()->json([
                'message' => 'Review not found in the database'
            ], 404);

        }

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        $user = Auth::user();

        $validatedData = $request->validate([
            'review_text' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        if (!$user || $review->user_id != $user->id) {
            return response()->json([
                'message' => 'Unauthorized request'
            ], 403);
        }

        try {
            $review->update($validatedData);

            return response()->json([
                'message' => 'Review updated successfully',
                'data' => $review
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'message' => 'Review not found in the database'
            ], 404);
        }


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {

        $user = Auth::user();

        if (!$user || $review->user_id != $user->id) {
            return response()->json([
                'message' => 'Unauthorized request'
            ], 403);
        }

        try {
            $review->delete();

            return response()->json([
                'message' => 'Review deleted successfully',
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'message' => 'Review not found in the database'
            ]);
        }

    }
}
