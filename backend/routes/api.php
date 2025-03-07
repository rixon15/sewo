<?php

use App\Http\Controllers\HotelController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

//auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify', [AuthController::class, 'verifyEmail']);
Route::post('/password/reset/email', [AuthController::class, 'sendPasswordResetEmail']);
Route::post('/password/reset', [AuthController::class, 'passwordReset']);

Route::middleware(['auth:sanctum'])->group(function () {
    //protected auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    //protected hotel routes
    Route::post('/hotels/create', [HotelController::class, 'store']);
    Route::delete('/hotels/{hotel}', [HotelController::class, 'destroy']);
    Route::patch('/hotels/{hotel}', [HotelController::class, 'update']);

});

//hotel routes

Route::get('/hotels/list', [HotelController::class, 'index']);
Route::get('/hotels/listByCategory', [HotelController::class, 'indexbyCategory']);
Route::get('/hotels/{hotel}', [HotelController::class, 'show']);


//health check
Route::get('/health', function () {
    return response()->json([
        'message' => 'Server is up and running'
    ]);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
