<?php

namespace App\Interfaces\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

interface CategoryRepositoryInterface
{
    /**
     * @return Collection
     */
    public function all(): Collection;

    /**
     * @param int $id
     * @return Category|null
     */
    public function findById(int $id): ?Category;

    /**
     * @param array $data
     * @return Category
     */
    public function create(array $data): Category;

    /**
     * @param Category $category
     * @param array $data
     * @return Category
     */
    public function update(Category $category, array $data): Category;

    /**
     * @param Category $category
     * @return bool
     */
    public function delete(Category $category): bool;
}
