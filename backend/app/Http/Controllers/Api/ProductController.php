<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\IndexProductRequest;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $productService
    )
    {
    }

    /**
     * @OA\Get(
     *     path="/api/v1/products",
     *     summary="Listar produtos",
     *     description="Retorna uma lista paginada de produtos com filtros opcionais.",
     *     tags={"Products"},
     *     @OA\Parameter(
     *         name="category",
     *         in="query",
     *         required=false,
     *         description="ID da categoria",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         required=false,
     *         description="Texto para busca por nome ou descrição",
     *         @OA\Schema(type="string", example="notebook")
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         required=false,
     *         description="Quantidade de itens por página",
     *         @OA\Schema(type="integer", example=10, minimum=1, maximum=50)
     *     ),
     *     @OA\Parameter(
     *         name="sort",
     *         in="query",
     *         required=false,
     *         description="Campo para ordenação",
     *         @OA\Schema(type="string", enum={"created_at","name","price"}, example="created_at")
     *     ),
     *     @OA\Parameter(
     *         name="direction",
     *         in="query",
     *         required=false,
     *         description="Direção da ordenação",
     *         @OA\Schema(type="string", enum={"asc","desc"}, example="desc")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Produtos recuperados com sucesso",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Products retrieved successfully."),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Notebook Dell"),
     *                     @OA\Property(property="description", type="string", nullable=true, example="Notebook com 16GB RAM"),
     *                     @OA\Property(property="price", type="string", example="4999.90"),
     *                     @OA\Property(property="image_url", type="string", nullable=true, example="https://site.com/imagem.jpg"),
     *                     @OA\Property(
     *                         property="category",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="name", type="string", example="Eletrônicos")
     *                     ),
     *                     @OA\Property(property="created_at", type="string", format="date-time", example="2026-03-27T10:00:00Z"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time", example="2026-03-27T10:00:00Z")
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="meta",
     *                 type="object",
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(property="last_page", type="integer", example=3),
     *                 @OA\Property(property="per_page", type="integer", example=10),
     *                 @OA\Property(property="total", type="integer", example=25)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Erro de validação"
     *     )
     * )
     */
    public function index(IndexProductRequest $request): JsonResponse
    {
        $products = $this->productService->list($request->validated());

        return response()->json(new ProductCollection($products));
    }

    /**
     * @OA\Get(
     *     path="/api/v1/products/{id}",
     *     summary="Buscar produto por ID",
     *     description="Retorna os dados de um produto específico.",
     *     tags={"Products"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do produto",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Produto recuperado com sucesso",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Product retrieved successfully."),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Notebook Dell"),
     *                 @OA\Property(property="description", type="string", nullable=true, example="Notebook com 16GB RAM"),
     *                 @OA\Property(property="price", type="string", example="4999.90"),
     *                 @OA\Property(property="image_url", type="string", nullable=true, example="https://site.com/imagem.jpg"),
     *                 @OA\Property(
     *                     property="category",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Eletrônicos")
     *                 ),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2026-03-27T10:00:00Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2026-03-27T10:00:00Z")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Produto não encontrado"
     *     )
     * )
     */
    public function show(int $id): JsonResponse
    {
        $product = $this->productService->show($id);

        return response()->json([
            'success' => true,
            'message' => 'Product retrieved successfully.',
            'data' => new ProductResource($product),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/products",
     *     summary="Criar produto",
     *     description="Cria um novo produto.",
     *     tags={"Products"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","price","category_id"},
     *             @OA\Property(property="name", type="string", maxLength=255, example="Notebook Dell"),
     *             @OA\Property(property="description", type="string", nullable=true, example="Notebook com 16GB RAM"),
     *             @OA\Property(property="price", type="number", format="float", example=4999.90),
     *             @OA\Property(property="category_id", type="integer", example=1),
     *             @OA\Property(property="image_url", type="string", nullable=true, example="https://site.com/imagem.jpg")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Produto criado com sucesso",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Product created successfully."),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Notebook Dell"),
     *                 @OA\Property(property="description", type="string", nullable=true, example="Notebook com 16GB RAM"),
     *                 @OA\Property(property="price", type="string", example="4999.90"),
     *                 @OA\Property(property="image_url", type="string", nullable=true, example="https://site.com/imagem.jpg"),
     *                 @OA\Property(
     *                     property="category",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Eletrônicos")
     *                 ),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2026-03-27T10:00:00Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2026-03-27T10:00:00Z")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Erro de validação"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autenticado"
     *     )
     * )
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->productService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully.',
            'data' => new ProductResource($product),
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/products/{id}",
     *     summary="Atualizar produto",
     *     description="Atualiza um produto existente.",
     *     tags={"Products"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do produto",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", maxLength=255, example="Notebook Dell Inspiron"),
     *             @OA\Property(property="description", type="string", nullable=true, example="Notebook atualizado"),
     *             @OA\Property(property="price", type="number", format="float", example=4599.90),
     *             @OA\Property(property="category_id", type="integer", example=2),
     *             @OA\Property(property="image_url", type="string", nullable=true, example="https://site.com/imagem-nova.jpg")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Produto atualizado com sucesso",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Product updated successfully."),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Notebook Dell Inspiron"),
     *                 @OA\Property(property="description", type="string", nullable=true, example="Notebook atualizado"),
     *                 @OA\Property(property="price", type="string", example="4599.90"),
     *                 @OA\Property(property="image_url", type="string", nullable=true, example="https://site.com/imagem-nova.jpg"),
     *                 @OA\Property(
     *                     property="category",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=2),
     *                     @OA\Property(property="name", type="string", example="Informática")
     *                 ),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2026-03-27T10:00:00Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2026-03-27T11:00:00Z")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Erro de validação"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autenticado"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Produto não encontrado"
     *     )
     * )
     */
    public function update(UpdateProductRequest $request, int $id): JsonResponse
    {
        $product = $this->productService->update($id, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully.',
            'data' => new ProductResource($product),
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/products/{id}",
     *     summary="Remover produto",
     *     description="Remove um produto existente.",
     *     tags={"Products"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do produto",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Produto removido com sucesso",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Product deleted successfully.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autenticado"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Produto não encontrado"
     *     )
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        $this->productService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully.',
        ]);
    }
}
