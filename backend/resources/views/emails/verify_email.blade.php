<h1>Email verification</h1>

<p>You are receiving this email because you have to verify your email.</p>

<p>Verify your email by pressing the button: </p>

<br>

<a href="{{ env('FRONT_END_AUTH_URL') . '/verify-email?token=' . $verification_token }}">
    <button>Verify Email</button>
</a>

<p>Please use this link to verify your email. This code will expire in 10 minutes.</p>
