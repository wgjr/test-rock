<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { createCategory, createProduct, deleteCategory, deleteProduct, getCategories, getProducts, updateCategory, updateProduct } from '../lib/api';
import { formatPrice, getErrorMessage } from '../lib/utils';
import type { Category, Product } from '../lib/types';

const categories = ref<Category[]>([]);
const products = ref<Product[]>([]);
const loading = ref(true);
const error = ref('');
const success = ref('');
const categoryName = ref('');
const editingCategoryId = ref<number | null>(null);
const submittingCategory = ref(false);
const submittingProduct = ref(false);
const productPage = ref(1);
const productTotalPages = ref(1);
const productTotal = ref(0);

const productForm = reactive({
  id: undefined as number | undefined,
  name: '',
  description: '',
  price: '',
  category_id: '',
  image_url: '',
});

const sortedProducts = computed(() => [...products.value].sort((a, b) => b.id - a.id));

function resetMessages() {
  error.value = '';
  success.value = '';
}

function startEditingCategory(category: Category) {
  editingCategoryId.value = category.id;
  categoryName.value = category.name;
}

function cancelCategoryEdit() {
  editingCategoryId.value = null;
  categoryName.value = '';
}

function resetProductForm() {
  productForm.id = undefined;
  productForm.name = '';
  productForm.description = '';
  productForm.price = '';
  productForm.category_id = '';
  productForm.image_url = '';
}

async function loadData(page = productPage.value) {
  loading.value = true;
  error.value = '';

  try {
    const [loadedCategories, loadedProducts] = await Promise.all([
      getCategories(),
      getProducts({
        page,
        per_page: 20,
        sort: 'created_at',
        direction: 'desc',
      }),
    ]);

    categories.value = loadedCategories;
    products.value = loadedProducts.items;
    productTotalPages.value = loadedProducts.meta?.last_page ?? 1;
    productTotal.value = loadedProducts.meta?.total ?? loadedProducts.items.length;
    productPage.value = page;
  } catch (err) {
    error.value = getErrorMessage(err, 'Não foi possível carregar a área administrativa.');
  } finally {
    loading.value = false;
  }
}

async function submitCategory() {
  resetMessages();
  submittingCategory.value = true;

  try {
    if (editingCategoryId.value) {
      await updateCategory(editingCategoryId.value, categoryName.value);
      success.value = 'Categoria atualizada com sucesso.';
    } else {
      await createCategory(categoryName.value);
      success.value = 'Categoria criada com sucesso.';
    }

    editingCategoryId.value = null;
    categoryName.value = '';
    await loadData();
  } catch (err) {
    error.value = getErrorMessage(err, 'Não foi possível salvar a categoria.');
  } finally {
    submittingCategory.value = false;
  }
}

async function removeCategory(id: number) {
  resetMessages();
  const category = categories.value.find((item) => item.id === id);
  const confirmed = window.confirm(`Excluir a categoria "${category?.name ?? id}"? Esta ação não pode ser desfeita.`);

  if (!confirmed) {
    return;
  }

  try {
    await deleteCategory(id);
    success.value = 'Categoria removida com sucesso.';
    await loadData();
  } catch (err) {
    error.value = getErrorMessage(err, 'Não foi possível remover a categoria.');
  }
}

function editProduct(product: Product) {
  productForm.id = product.id;
  productForm.name = product.name;
  productForm.description = product.description ?? '';
  productForm.price = String(product.price);
  productForm.category_id = product.category?.id ? String(product.category.id) : '';
  productForm.image_url = product.image_url ?? '';
}

async function submitProduct() {
  resetMessages();
  submittingProduct.value = true;

  try {
    const payload = {
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      category_id: Number(productForm.category_id),
      image_url: productForm.image_url || '',
    };

    if (productForm.id) {
      await updateProduct(productForm.id, payload);
      success.value = 'Produto atualizado com sucesso.';
    } else {
      await createProduct(payload);
      success.value = 'Produto criado com sucesso.';
    }

    resetProductForm();
    await loadData();
  } catch (err) {
    error.value = getErrorMessage(err, 'Não foi possível salvar o produto.');
  } finally {
    submittingProduct.value = false;
  }
}

async function removeProduct(id: number) {
  resetMessages();
  const product = products.value.find((item) => item.id === id);
  const confirmed = window.confirm(`Excluir o produto "${product?.name ?? id}"? Esta ação não pode ser desfeita.`);

  if (!confirmed) {
    return;
  }

  try {
    await deleteProduct(id);
    success.value = 'Produto removido com sucesso.';
    await loadData();
  } catch (err) {
    error.value = getErrorMessage(err, 'Não foi possível remover o produto.');
  }
}

onMounted(() => {
  loadData(1);
});
</script>

<template>
  <div v-if="loading" class="rounded-[2rem] bg-white px-6 py-16 text-center text-sm text-slate-500 shadow-soft">
    Carregando área administrativa...
  </div>
  <div v-else class="space-y-8">
    <section class="rounded-[2rem] bg-gradient-to-br from-slate-950 to-emerald-700 p-8 text-white shadow-soft">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">Área protegida</p>
      <h1 class="mt-3 text-3xl font-bold">CRUD de categorias e produtos com Bearer token</h1>
      <p class="mt-3 max-w-3xl text-sm text-slate-200">
        Esta tela usa os endpoints protegidos do backend para criação, edição e exclusão, agora em Vue 3.
      </p>
    </section>

    <div v-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {{ error }}
    </div>
    <div v-if="success" class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
      {{ success }}
    </div>

    <section class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div class="space-y-6">
        <div class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <div class="mb-6 flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Categorias</p>
              <h2 class="mt-2 text-2xl font-bold text-slate-900">Gerenciar categorias</h2>
            </div>
            <button
              v-if="editingCategoryId"
              type="button"
              class="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
              @click="cancelCategoryEdit"
            >
              Cancelar edição
            </button>
          </div>

          <form class="space-y-4" @submit.prevent="submitCategory">
            <label class="block">
              <span class="mb-2 block text-sm font-medium text-slate-700">Nome da categoria</span>
              <input v-model="categoryName" required class="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
            </label>
            <button type="submit" class="w-full rounded-full bg-slate-950 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70" :disabled="submittingCategory">
              {{ submittingCategory ? 'Salvando...' : editingCategoryId ? 'Salvar categoria' : 'Criar categoria' }}
            </button>
          </form>

          <div class="mt-6 space-y-3">
            <div v-if="categories.length === 0" class="rounded-[2rem] bg-[#fffdf9] px-6 py-12 text-center">
              <h3 class="text-xl font-black tracking-[-0.03em] text-slate-950">Sem categorias</h3>
              <p class="mt-3 text-sm text-slate-500">Crie a primeira categoria para começar.</p>
            </div>
            <div v-for="category in categories" :key="category.id" class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4">
              <div>
                <p class="font-semibold text-slate-900">{{ category.name }}</p>
                <p class="text-sm text-slate-500">ID #{{ category.id }}</p>
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="rounded-full bg-[#f4efe6] px-4 py-2 text-sm font-medium text-slate-700"
                  @click="startEditingCategory(category)"
                >
                  Editar
                </button>
                <button type="button" class="rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700" @click="removeCategory(category.id)">
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <div class="mb-6 flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Produtos</p>
              <h2 class="mt-2 text-2xl font-bold text-slate-900">{{ productForm.id ? 'Editar produto' : 'Novo produto' }}</h2>
            </div>
            <button
              v-if="productForm.id"
              type="button"
              class="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
              @click="resetProductForm"
            >
              Limpar
            </button>
          </div>

          <form class="grid gap-4" @submit.prevent="submitProduct">
            <label class="block">
              <span class="mb-2 block text-sm font-medium text-slate-700">Nome</span>
              <input v-model="productForm.name" required class="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
            </label>
            <label class="block">
              <span class="mb-2 block text-sm font-medium text-slate-700">Descrição</span>
              <textarea v-model="productForm.description" rows="4" class="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
            </label>
            <div class="grid gap-4 md:grid-cols-2">
              <label class="block">
                <span class="mb-2 block text-sm font-medium text-slate-700">Preço</span>
                <input v-model="productForm.price" type="number" min="0" step="0.01" required class="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
              </label>
              <label class="block">
                <span class="mb-2 block text-sm font-medium text-slate-700">Categoria</span>
                <select v-model="productForm.category_id" required class="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
                  <option disabled value="">Selecione</option>
                  <option v-for="category in categories" :key="category.id" :value="String(category.id)">
                    {{ category.name }}
                  </option>
                </select>
              </label>
            </div>
            <label class="block">
              <span class="mb-2 block text-sm font-medium text-slate-700">Imagem URL</span>
              <input v-model="productForm.image_url" class="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
            </label>
            <button type="submit" class="w-full rounded-full bg-slate-950 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70" :disabled="submittingProduct">
              {{ submittingProduct ? 'Salvando...' : productForm.id ? 'Atualizar produto' : 'Criar produto' }}
            </button>
          </form>
        </div>
      </div>

      <div class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <div class="mb-6 flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Estoque</p>
            <h2 class="mt-2 text-2xl font-bold text-slate-900">Produtos cadastrados</h2>
          </div>
          <div class="rounded-full bg-[#d5f5e8] px-4 py-2 text-sm font-medium text-emerald-900">
            {{ productTotal }} itens
          </div>
        </div>

        <div class="space-y-4">
          <div v-if="sortedProducts.length === 0" class="rounded-[2rem] bg-[#fffdf9] px-6 py-12 text-center">
            <h3 class="text-xl font-black tracking-[-0.03em] text-slate-950">Sem produtos</h3>
            <p class="mt-3 text-sm text-slate-500">Cadastre o primeiro produto para começar.</p>
          </div>
          <div v-for="product in sortedProducts" :key="product.id" class="rounded-[2rem] border border-slate-200 p-4">
            <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div class="space-y-2">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="rounded-full bg-[#d5f5e8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
                    {{ product.category?.name || 'Sem categoria' }}
                  </span>
                  <span class="text-sm text-slate-400">#{{ product.id }}</span>
                </div>
                <h3 class="text-xl font-bold text-slate-900">{{ product.name }}</h3>
                <p class="text-sm leading-6 text-slate-500">{{ product.description || 'Sem descrição cadastrada.' }}</p>
                <strong class="block text-lg font-black text-emerald-700">{{ formatPrice(product.price) }}</strong>
              </div>
              <div class="flex gap-2">
                <button type="button" class="rounded-full bg-[#f4efe6] px-4 py-2 text-sm font-medium text-slate-700" @click="editProduct(product)">
                  Editar
                </button>
                <button type="button" class="rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700" @click="removeProduct(product.id)">
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="productTotalPages > 1" class="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            v-for="page in productTotalPages"
            :key="page"
            type="button"
            :class="[
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              page === productPage ? 'bg-slate-950 text-white' : 'bg-[#f4efe6] text-slate-700 hover:bg-[#ece3d2]'
            ]"
            @click="loadData(page)"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
