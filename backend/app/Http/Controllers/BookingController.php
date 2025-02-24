<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Review;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $request->query('limit', 1);

        $bookings = Booking::query()->paginate($limit);

        if ($bookings->isNotEmpty()) {
            return response()->json([
                'message' => 'Bookings retrieved successfully',
                'data' => $bookings
            ], 201);
        } else {
            return response()->json([
                'message' => 'Booking not found in the database'
            ], 401);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|gt:start_date',
            'hotel_id' => 'required|integer'
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized request!'
            ], 401);
        }

        $booking = Booking::query()
            ->where('start_date', $request->start_date)
            ->where('end_date', $request->end_date)
            ->where('hotel_id', $request->hotel_id)
            ->first();

        if ($booking) {
            return response()->json([
                'message' => 'Booking with this date already exists in the database'
            ], 403);
        }

        $newBooking = new Booking($validatedData);
        $newBooking->user_id = $user->id;
        $newBooking->save();

        return response()->json([
            'message' => 'Booking successfully added to the database',
            'data' => $newBooking
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {

        try {
            return response()->json([
                'message' => 'Booking retrieved successfully',
                'data' => $booking
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'message' => 'Booking not found in the database'
            ], 404);
        }

    }

    /**
     * Update the specified resource in storage.
     */
    public
    function update(Booking $booking, Request $request)
    {

        $validatedData = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|gt:start_date',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized request!'
            ], 401);
        }

        if ($booking->user_id != $user->id) {
            return response()->json([
                'message' => 'Unauthorized request!'
            ], 401);
        }

        try {

            $booking->update($validatedData);
            return response()->json([
                'message' => 'Booking updated successfully',
                'data' => $booking
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'message' => 'Booking not found in the database'
            ], 404);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public
    function destroy(Booking $booking)
    {

        $user = Auth::user();

        if (!$user || $booking->user_id != $user->id) {
            return response()->json([
                'message' => 'Unauthorized request'
            ], 401);
        }

        try {
            $booking->delete();

            return response()->json([
                'message' => 'Booking deleted successfully'
            ]);
        } catch (ModelNotFoundException) {

            return response()->json([
                'message' => 'Booking not found in the database!'
            ], 404);

        }

    }

    public
    function confirmBooking(Booking $booking)
    {

        $user = Auth::user();

        if (!$user || $booking->user_id != $user->id) {
            return response()->json([
                'message' => 'Unauthorized request'
            ]);
        }

        try {
            $booking->confirmed = true;
            $booking->confirmed_at = Carbon::now();
            $booking->save();

            return response()->json([
                'message' => 'Booking updated successfully',
                'data' => $booking
            ]);
        } catch (ModelNotFoundException) {
            return response()->json([
                'message' => 'Booking not found in the database'
            ], 404);
        }

    }
}
