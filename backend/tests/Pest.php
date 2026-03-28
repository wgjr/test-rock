<?php

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
*/

pest()->extend(TestCase::class)->in('Feature', 'Unit');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
*/

function setupApiDatabaseSchema(): void
{
    \Illuminate\Support\Facades\DB::purge();
    \Illuminate\Support\Facades\Schema::dropAllTables();

    \Illuminate\Support\Facades\Schema::create('users', function (\Illuminate\Database\Schema\Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email')->unique();
        $table->timestamp('email_verified_at')->nullable();
        $table->string('password');
        $table->rememberToken()->nullable();
        $table->timestamps();
    });

    \Illuminate\Support\Facades\Schema::create('categories', function (\Illuminate\Database\Schema\Blueprint $table) {
        $table->id();
        $table->string('name')->unique();
        $table->timestamps();
    });

    \Illuminate\Support\Facades\Schema::create('products', function (\Illuminate\Database\Schema\Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->text('description')->nullable();
        $table->decimal('price', 10, 2);
        $table->foreignId('category_id')->constrained()->cascadeOnDelete();
        $table->string('image_url', 2048)->nullable();
        $table->timestamps();
    });

    \Illuminate\Support\Facades\Schema::create('personal_access_tokens', function (\Illuminate\Database\Schema\Blueprint $table) {
        $table->id();
        $table->morphs('tokenable');
        $table->text('name');
        $table->string('token', 64)->unique();
        $table->text('abilities')->nullable();
        $table->timestamp('last_used_at')->nullable();
        $table->timestamp('expires_at')->nullable();
        $table->timestamps();
    });
}
