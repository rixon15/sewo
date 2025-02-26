<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetEmail;
use App\Mail\VerifyEmail;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Str;
use URL;

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
        ]);
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
            'verification_token' => Str::random(60)
        ]);


        if ($user) {
            $token = $user->createToken($user->name, ['Auth-Token'])->plainTextToken;

            Mail::to($user->email)->send(new VerifyEmail($user->verification_token));

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

    public function logout(Request $request): JsonResponse
    {
        $user = User::where('id', $request->user()->id)->first();
        if ($user) {
            $user->tokens()->delete();

            return response()->json([
                'message' => 'Logged out successfully'
            ]);
        } else {
            return response()->json([
                'message' => 'User Not Found'
            ], 404);
        }
    }

    public function profile(Request $request): JsonResponse
    {
        if ($request->user()) {
            return response()->json([
                'message' => 'Profile Fetched.',
                'data' => $request->user()
            ]);
        } else {
            return response()->json([
                'message' => 'Not Authenticated.'
            ], 401);
        }
    }

    public function verifyEmail(Request $request): JsonResponse
    {

        $token = $request->input('token');

        if (!$token) {
            return response()->json([
                'message' => 'Verification token is missing!'
            ], 404);
        }

        $user = User::where('users.verification_token', $token)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Invalid verification token'
            ], 404);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email already verified'
            ]);
        }

        $user->email_verified_at = Carbon::now();
        $user->verification_token = null;
        $user->save();

        return response()->json([
            'message' => 'Email verified successfully'
        ]);

    }

    /**
     * @param Request $request
     * @propery string $email
     * @return RedirectResponse
     */
    public function sendPasswordResetEmail(Request $request): RedirectResponse
    {

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors(['email' => 'No user associated with the submitted email address']);
        }

        $token = Str::random();
        $expiry = Carbon::now()->addMinutes(10);

        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => Hash::make($token),
            'created_at' => Carbon::now()
        ]);


        $verificationLink = URL::temporarySignedRoute(
            'password.reset',
            $expiry,
            ['token' => $token, 'email' => $user->email]
        );

        try {
            Mail::to($user->email)->send(new PasswordResetEmail($verificationLink));
        } catch (Exception $e) {
            Log::error($e);
            return back()->withErrors(['email' => 'An error occurred while sending the email']);
        }

        return back()->with(['status' => 'A password reset link has been sent to your email']);

    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @property string $email
     * @property string $password
     * @property string $token
     */
    public function passwordReset(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|max:255',
        ]);

        $passwordResetToken = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('created_at', '>', Carbon::now()->subMinutes(10))
            ->first();

        if ($passwordResetToken && Hash::check($request->token, $passwordResetToken->token)) {



            $user = User::where('email', $request->email)->first();
            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }

            $user->password = Hash::make($request->password);
            $user->save();

            DB::table('password_reset_tokens')->where('email', $user->email)->delete();

            return response()->json([
                'message' => 'Password reset successfully'
            ]);


        }

        return response()->json([
            'message' => 'Something went wrong on the server'
        ], 500);
    }

}
