<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/verify', [AuthController::class, 'verifyEmail']);
Route::post('/password/reset/email', [AuthController::class, 'sendPasswordResetEmail']);
Route::get('/password/reset', [AuthController::class, 'passwordReset']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

});

Route::get('/', function () {
    return response()->json([
        'message' => 'Server is up and running'
    ]);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
