<?php

namespace App\Swagger;

use OpenApi\Annotations as OA;

/**
 * @OA\OpenApi(
 *     @OA\Info(
 *         title="Ecommerce API",
 *         version="1.0.0",
 *         description="Documentação da API de Ecommerce"
 *     ),
 *     @OA\Server(
 *         url="http://localhost:8000",
 *         description="Servidor local"
 *     ),
 *     @OA\Components(
 *         @OA\SecurityScheme(
 *             securityScheme="sanctum",
 *             type="http",
 *             scheme="bearer",
 *             bearerFormat="JWT",
 *             description="Informe o token no formato Bearer {token}"
 *         )
 *     ),
 *     @OA\Tag(
 *         name="Auth",
 *         description="Autenticação"
 *     ),
 *     @OA\Tag(
 *         name="Categories",
 *         description="Gerenciamento de categorias"
 *     ),
 *     @OA\Tag(
 *         name="Products",
 *         description="Gerenciamento de produtos"
 *     )
 * )
 */
class OpenApi
{
}
