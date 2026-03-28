<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    config()->set('database.default', 'sqlite');
    config()->set('database.connections.sqlite.database', ':memory:');

    setupApiDatabaseSchema();
});

it('filters products by category and search term', function () {
    $electronics = Category::factory()->create(['name' => 'Eletrônicos']);
    $books = Category::factory()->create(['name' => 'Livros']);

    Product::factory()->create([
        'name' => 'Notebook Pro',
        'description' => 'Computador para trabalho',
        'category_id' => $electronics->id,
    ]);

    Product::factory()->create([
        'name' => 'Livro de Laravel',
        'description' => 'Aprenda Laravel do zero',
        'category_id' => $books->id,
    ]);

    $response = $this->getJson("/api/v1/products?category={$electronics->id}&search=Notebook");

    $response
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name', 'Notebook Pro')
        ->assertJsonPath('data.0.category.id', $electronics->id)
        ->assertJsonPath('data.0.category.name', 'Eletrônicos');
});

it('shows a single product with its category', function () {
    $category = Category::factory()->create(['name' => 'Eletrônicos']);
    $product = Product::factory()->create([
        'name' => 'Mouse Gamer',
        'category_id' => $category->id,
        'price' => 199.90,
    ]);

    $this->getJson("/api/v1/products/{$product->id}")
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Product retrieved successfully.')
        ->assertJsonPath('data.id', $product->id)
        ->assertJsonPath('data.name', 'Mouse Gamer')
        ->assertJsonPath('data.price', '199.90')
        ->assertJsonPath('data.category.id', $category->id)
        ->assertJsonPath('data.category.name', 'Eletrônicos');
});

it('creates a product for authenticated users', function () {
    Sanctum::actingAs(User::factory()->create());
    $category = Category::factory()->create(['name' => 'Eletrônicos']);

    $response = $this->postJson('/api/v1/products', [
        'name' => 'Teclado Mecânico',
        'description' => 'Switch blue',
        'price' => 349.90,
        'category_id' => $category->id,
        'image_url' => 'https://example.com/keyboard.jpg',
    ]);

    $response
        ->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Product created successfully.')
        ->assertJsonPath('data.name', 'Teclado Mecânico')
        ->assertJsonPath('data.category.id', $category->id);

    expect(Product::query()->where('name', 'Teclado Mecânico')->exists())->toBeTrue();
});

it('validates product payload on creation', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->postJson('/api/v1/products', [
        'name' => '',
        'price' => -10,
        'category_id' => 999999,
        'image_url' => 'not-an-url',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'price', 'category_id', 'image_url']);
});

it('updates a product for authenticated users', function () {
    Sanctum::actingAs(User::factory()->create());
    $oldCategory = Category::factory()->create(['name' => 'Acessórios']);
    $newCategory = Category::factory()->create(['name' => 'Periféricos']);
    $product = Product::factory()->create([
        'name' => 'Headset',
        'price' => 299.90,
        'category_id' => $oldCategory->id,
    ]);

    $this->putJson("/api/v1/products/{$product->id}", [
        'name' => 'Headset Wireless',
        'price' => 399.90,
        'category_id' => $newCategory->id,
    ])
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Product updated successfully.')
        ->assertJsonPath('data.name', 'Headset Wireless')
        ->assertJsonPath('data.price', '399.90')
        ->assertJsonPath('data.category.id', $newCategory->id);

    expect($product->fresh()->name)->toBe('Headset Wireless');
});

it('deletes a product for authenticated users', function () {
    Sanctum::actingAs(User::factory()->create());
    $product = Product::factory()->create();

    $this->deleteJson("/api/v1/products/{$product->id}")
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', 'Product deleted successfully.');

    expect(Product::find($product->id))->toBeNull();
});

it('requires authentication to mutate products', function () {
    $product = Product::factory()->create();

    $this->postJson('/api/v1/products', [])->assertUnauthorized();
    $this->putJson("/api/v1/products/{$product->id}", ['name' => 'Novo'])->assertUnauthorized();
    $this->deleteJson("/api/v1/products/{$product->id}")->assertUnauthorized();
});
