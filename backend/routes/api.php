<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1/auth')->as('auth.')->group(base_path('routes/Groups/Auth.php'));

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

