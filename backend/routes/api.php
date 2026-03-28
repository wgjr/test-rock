<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1/auth')->as('auth.')->group(base_path('routes/Groups/Auth.php'));

Route::prefix('v1/products')->group(base_path('routes/Groups/Products.php'));
Route::prefix('v1/categories')->group(base_path('routes/Groups/Categories.php'));

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

