<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * @param array $data
     * @return array
     */
    public function register(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * @param array $data
     * @return array
     */
    public function login(array $data): array
    {
        if (!Auth::attempt($data)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials']
            ]);
        }

        $user = Auth::user();

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * @return void
     */
    public function logout(): void
    {
        auth()->user()->tokens()->delete();
    }
}
