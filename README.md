# 🛒 Rock Full Stack Test

Aplicação full stack de catálogo de e-commerce com autenticação, desenvolvida com foco em **boas práticas de arquitetura**, **padronização de API** e **ambiente containerizado**.

---

## 🚀 Visão Geral

Este projeto implementa um catálogo de produtos com:

- Listagem paginada
- Filtro por categoria
- Busca por produtos
- Autenticação de usuários
- Consumo de API REST padronizada

Toda a aplicação roda isoladamente via Docker.

---

## 🧱 Stack Tecnológica

| Camada       | Tecnologia              |
|-------------|------------------------|
| Backend     | Laravel (PHP)          |
| Frontend    | React + Vite           |
| Banco       | MySQL                  |
| Auth        | Laravel Sanctum        |
| Docs API    | Swagger / OpenAPI      |
| Observabilidade | Laravel Telescope |
| Infra       | Docker + Docker Compose|

---

## ⚙️ Setup do Projeto

### 📦 Subir ambiente completo

```bash
docker compose up -d --build
```

---

### 🔧 Comandos backend (Opicional o setup do docker composer já executa a suite de comandos)

```bash
docker compose exec app composer install

docker compose exec app php artisan key:generate

docker compose exec app php artisan migrate

docker compose exec app php artisan db:seed
```

---

### 🔧 Tests unitários da aplicação

```bash
docker compose exec app php artisan test
```

---

##

## 🔐 Autenticação

A aplicação utiliza autenticação baseada em token com Sanctum.

### Endpoints:

- `POST /api/register` → Cadastro de usuário
- `POST /api/login` → Login e geração de token

O token deve ser enviado nas requisições autenticadas via header:

```
Authorization: Bearer {token}
```

---

## Acesso administrativo

email: admin@example.com
senha: password

---

## 📡 Endpoints Principais

### Produtos

- `GET /api/products` → Listagem paginada
- `GET /api/products/{id}` → Detalhe do produto
- `GET /api/products?category={id}` → Filtro por categoria
- `GET /api/products?search={query}` → Busca

### Categorias

- `GET /api/categories` → Listagem de categorias

---

## 📚 Documentação da API

- Swagger UI:
  http://localhost:8000/api/documentation

- OpenAPI JSON:
  http://localhost:8000/docs?api-docs.json

---

## Documentação pública

- API Dog
  https://evfvaof9yg.apidog.io/


## 📊 Observabilidade

Monitoramento e debug disponíveis via Laravel Telescope:

```
http://localhost:8000/telescope
```

---

## 🖥️ Frontend

Interface disponível em:

```
http://localhost:5173
```

---

## 📁 Estrutura do Projeto

```
.
├── backend     # API Laravel (Service + Repository)
├── frontend    # Aplicação React
├── docker      # Configuração de containers
└── docker-compose.yml
```

---

## 🧠 Arquitetura Backend

O backend segue princípios de separação de responsabilidades:

- **Controllers:** camada de entrada (HTTP)
- **Services:** regras de negócio
- **Repositories:** acesso a dados
- **Response Pattern:** padronização de respostas da API

---

## ▶️ Fluxo de Execução

1. Subir containers com Docker
2. Rodar setup do backend
3. Acessar frontend
4. Criar conta ou logar
5. Consumir catálogo de produtos

---

## 📌 Boas Práticas Aplicadas

- Arquitetura desacoplada (Service + Repository)
- API RESTful padronizada
- Autenticação segura com tokens
- Containerização completa
- Separação clara entre frontend e backend
- Código preparado para escalabilidade

---

## 🧪 Ambiente Reprodutível

Toda a aplicação pode ser executada localmente com um único comando (`docker compose up`), garantindo consistência entre ambientes.

---

## 📎 Observações Finais

- Projeto preparado para avaliação técnica de nível sênior
- Estrutura organizada e extensível
- Pronto para evolução (ex: CI/CD, testes automatizados, caching, etc.)

---