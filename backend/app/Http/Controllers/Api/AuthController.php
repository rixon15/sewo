<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\Fluent\Concerns\Has;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:8|max:255'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'The provided credentials are invalid'
            ], 401);
        }

        $token = $user->createToken($user->name, ['Auth-Token'])->plainTextToken;

        return response()->json([
            'message' => 'Login Successful',
            'toke_type' => 'Bearer',
            'token' => $token
        ], 200);
    }

    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|min:1|max:255',
            'email' => 'required|string|unique:users,email|min:5|max:255',
            'password' => 'required|string|min:8|max:255'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if ($user) {
            $token = $user->createToken($user->name, ['Auth-Token'])->plainTextToken;

            return response()->json([
                'message' => 'Registration Successful',
                'toke_type' => 'Bearer',
                'token' => $token
            ], 201);
        } else {
            return response()->json([
                'message' => 'Something went wrong!'
            ], 500);
        }
    }
}
