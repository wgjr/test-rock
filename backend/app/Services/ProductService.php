<?php

namespace App\Services;

use App\Interfaces\Repositories\ProductRepositoryInterface;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductService
{
    public function __construct(
        private ProductRepositoryInterface $productRepository
    )
    {
    }

    /**
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function list(array $filters): LengthAwarePaginator
    {
        return $this->productRepository->paginateWithFilters($filters);
    }

    /**
     * @param int $id
     * @return Product
     */
    public function show(int $id): Product
    {
        $product = $this->productRepository->findById($id);

        if (!$product) {
            throw new ModelNotFoundException('Product not found.');
        }

        return $product;
    }

    /**
     * @param array $data
     * @return Product
     */
    public function create(array $data): Product
    {
        return $this->productRepository->create($data);
    }

    /**
     * @param int $id
     * @param array $data
     * @return Product
     */
    public function update(int $id, array $data): Product
    {
        $product = $this->show($id);

        return $this->productRepository->update($product, $data);
    }

    /**
     * @param int $id
     * @return void
     */
    public function delete(int $id): void
    {
        $product = $this->show($id);

        $this->productRepository->delete($product);
    }
}
