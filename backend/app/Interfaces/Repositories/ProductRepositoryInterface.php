<?php

namespace App\Interfaces\Repositories;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface
{
    /**
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function paginateWithFilters(array $filters): LengthAwarePaginator;

    /**
     * @param int $id
     * @return Product|null
     */
    public function findById(int $id): ?Product;

    /**
     * @param array $data
     * @return Product
     */
    public function create(array $data): Product;

    /**
     * @param Product $product
     * @param array $data
     * @return Product
     */
    public function update(Product $product, array $data): Product;

    /**
     * @param Product $product
     * @return bool
     */
    public function delete(Product $product): bool;
}
