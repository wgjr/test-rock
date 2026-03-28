<?php

use App\Models\Category;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    config()->set('database.default', 'sqlite');
    config()->set('database.connections.sqlite.database', ':memory:');

    setupApiDatabaseSchema();
});

it('lists categories ordered by name', function () {
    Category::factory()->create(['name' => 'Zeladoria']);
    Category::factory()->create(['name' => 'Alimentos']);
    Category::factory()->create(['name' => 'Bebidas']);

    $response = $this->getJson('/api/v1/categories');

    $response
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Categories retrieved successfully.')
        ->assertJsonCount(3, 'data')
        ->assertJsonPath('data.0.name', 'Alimentos')
        ->assertJsonPath('data.1.name', 'Bebidas')
        ->assertJsonPath('data.2.name', 'Zeladoria');
});

it('shows a single category', function () {
    $category = Category::factory()->create(['name' => 'Eletrônicos']);

    $this->getJson("/api/v1/categories/{$category->id}")
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Category retrieved successfully.')
        ->assertJsonPath('data.id', $category->id)
        ->assertJsonPath('data.name', 'Eletrônicos');
});

it('returns not found when category does not exist', function () {
    $this->getJson('/api/v1/categories/999999')->assertNotFound();
});

it('creates a category for authenticated users', function () {
    Sanctum::actingAs(User::factory()->create());

    $response = $this->postJson('/api/v1/categories', [
        'name' => 'Limpeza',
    ]);

    $response
        ->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Category created successfully.')
        ->assertJsonPath('data.name', 'Limpeza');

    expect(Category::query()->where('name', 'Limpeza')->exists())->toBeTrue();
});

it('validates unique category name on creation', function () {
    Sanctum::actingAs(User::factory()->create());
    Category::factory()->create(['name' => 'Limpeza']);

    $this->postJson('/api/v1/categories', ['name' => 'Limpeza'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('name');
});

it('requires authentication to create a category', function () {
    $this->postJson('/api/v1/categories', ['name' => 'Limpeza'])->assertUnauthorized();
});

it('updates a category for authenticated users', function () {
    Sanctum::actingAs(User::factory()->create());
    $category = Category::factory()->create(['name' => 'Informática']);

    $this->putJson("/api/v1/categories/{$category->id}", [
        'name' => 'Periféricos',
    ])
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Category updated successfully.')
        ->assertJsonPath('data.name', 'Periféricos');

    expect($category->fresh()->name)->toBe('Periféricos');
});

it('deletes a category for authenticated users', function () {
    Sanctum::actingAs(User::factory()->create());
    $category = Category::factory()->create();

    $this->deleteJson("/api/v1/categories/{$category->id}")
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Category deleted successfully.');

    expect(Category::find($category->id))->toBeNull();
});
