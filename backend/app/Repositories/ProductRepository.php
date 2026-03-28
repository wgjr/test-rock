<?php

namespace App\Repositories;

use App\Interfaces\Repositories\ProductRepositoryInterface;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductRepository implements ProductRepositoryInterface
{
    /**
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function paginateWithFilters(array $filters): LengthAwarePaginator
    {
        $perPage = (int)($filters['per_page'] ?? 10);
        $perPage = min(max($perPage, 1), 50);

        $query = Product::query()
            ->with('category');

        if (!empty($filters['category'])) {
            $query->where('category_id', (int)$filters['category']);
        }

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $sort = $filters['sort'] ?? 'created_at';
        $direction = strtolower($filters['direction'] ?? 'desc');

        $allowedSorts = ['created_at', 'name', 'price'];
        $sort = in_array($sort, $allowedSorts, true) ? $sort : 'created_at';
        $direction = in_array($direction, ['asc', 'desc'], true) ? $direction : 'desc';

        $query->orderBy($sort, $direction);

        return $query->paginate($perPage)->appends($filters);
    }

    /**
     * @param int $id
     * @return Product|null
     */
    public function findById(int $id): ?Product
    {
        return Product::with('category')->find($id);
    }

    /**
     * @param array $data
     * @return Product
     */
    public function create(array $data): Product
    {
        return Product::create($data)->load('category');
    }

    /**
     * @param Product $product
     * @param array $data
     * @return Product
     */
    public function update(Product $product, array $data): Product
    {
        $product->update($data);

        return $product->load('category');
    }

    /**
     * @param Product $product
     * @return bool
     */
    public function delete(Product $product): bool
    {
        return $product->delete();
    }
}
