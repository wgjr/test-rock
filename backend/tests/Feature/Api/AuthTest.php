<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    config()->set('database.default', 'sqlite');
    config()->set('database.connections.sqlite.database', ':memory:');

    setupApiDatabaseSchema();
});

it('registers a user and returns a token', function () {
    $response = $this->postJson('/api/v1/auth/register', [
        'name' => 'Maria Silva',
        'email' => 'maria@example.com',
        'password' => 'SecurePass123',
        'password_confirmation' => 'SecurePass123',
    ]);

    $response
        ->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'User registered successfully')
        ->assertJsonPath('data.user.name', 'Maria Silva')
        ->assertJsonPath('data.user.email', 'maria@example.com')
        ->assertJsonPath('data.user.role', 'user')
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'user' => ['id', 'name', 'email', 'role', 'created_at', 'updated_at'],
                'token',
            ],
        ]);

    expect(User::query()->where('email', 'maria@example.com')->exists())->toBeTrue();
    expect(Hash::check('SecurePass123', User::first()->password))->toBeTrue();
});

it('validates required fields on registration', function () {
    $response = $this->postJson('/api/v1/auth/register', []);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'email', 'password']);
});

it('validates password confirmation and strength on registration', function () {
    $response = $this->postJson('/api/v1/auth/register', [
        'name' => 'Maria Silva',
        'email' => 'maria@example.com',
        'password' => 'SecurePass123',
        /** Intentionally wrong confirmation */
        'password_confirmation' => 'OtherPass123',
    ]);

    $response->assertUnprocessable()->assertJsonValidationErrors('password');

    $weak = $this->postJson('/api/v1/auth/register', [
        'name' => 'Maria Silva',
        'email' => 'weak@example.com',
        'password' => 'alllowercase12345',
        'password_confirmation' => 'alllowercase12345',
    ]);

    /** Missing uppercase */
    $weak->assertUnprocessable()->assertJsonValidationErrors('password');
});

it('logs in a user and returns a token', function () {
    $user = User::factory()->create([
        'email' => 'joao@example.com',
        'password' => Hash::make('secret123'),
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'joao@example.com',
        'password' => 'secret123',
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Login successful')
        ->assertJsonPath('data.user.id', $user->id)
        ->assertJsonPath('data.user.role', 'user')
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'user' => ['id', 'name', 'email', 'role', 'created_at', 'updated_at'],
                'token',
            ],
        ]);
});

it('rejects login with invalid credentials', function () {
    User::factory()->create([
        'email' => 'joao@example.com',
        'password' => Hash::make('secret123'),
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'joao@example.com',
        'password' => 'wrong-password',
    ]);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors('email');
});

it('logs out the authenticated user and revokes tokens', function () {
    $user = User::factory()->create();
    $token = $user->createToken('auth_token')->plainTextToken;

    expect($user->tokens()->count())->toBe(1);

    $response = $this
        ->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/api/v1/auth/logout');

    $response
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Logged out successfully');

    expect($user->fresh()->tokens()->count())->toBe(0);
});

it('requires authentication to logout', function () {
    $this->postJson('/api/v1/auth/logout')->assertUnauthorized();
});
