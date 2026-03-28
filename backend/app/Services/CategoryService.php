<?php

namespace App\Services;

use App\Interfaces\Repositories\CategoryRepositoryInterface;
use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CategoryService
{
    public function __construct(
        private CategoryRepositoryInterface $categoryRepository
    )
    {
    }

    /**
     * @return Collection
     */
    public function list(): Collection
    {
        return $this->categoryRepository->all();
    }

    /**
     * @param int $id
     * @return Category
     */
    public function show(int $id): Category
    {
        $category = $this->categoryRepository->findById($id);

        if (!$category) {
            throw new ModelNotFoundException('Category not found.');
        }

        return $category;
    }

    /**
     * @param array $data
     * @return Category
     */
    public function create(array $data): Category
    {
        return $this->categoryRepository->create($data);
    }

    /**
     * @param int $id
     * @param array $data
     * @return Category
     */
    public function update(int $id, array $data): Category
    {
        $category = $this->show($id);

        return $this->categoryRepository->update($category, $data);
    }

    /**
     * @param int $id
     * @return void
     */
    public function delete(int $id): void
    {
        $category = $this->show($id);

        $this->categoryRepository->delete($category);
    }
}
