<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCategories, getProducts } from '../lib/api';
import { formatPrice, getErrorMessage } from '../lib/utils';
import type { Category, Product } from '../lib/types';

const route = useRoute();
const router = useRouter();

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const error = ref('');
const loading = ref(true);
const meta = ref({ current_page: 1, last_page: 1, per_page: 9, total: 0 });

const filters = computed(() => ({
  page: Number(route.query.page || 1),
  search: String(route.query.search || ''),
  category: String(route.query.category || ''),
  sort: String(route.query.sort || 'created_at'),
  direction: String(route.query.direction || 'desc'),
  per_page: Number(route.query.per_page || 9),
}));

function handleSortChange(value: string) {
  const [sort, direction] = value.split(':');
  updateFilter('sort', sort);
  updateFilter('direction', direction);
}

function updateFilter(name: string, value: string) {
  const query = { ...route.query } as Record<string, string>;

  if (value) {
    query[name] = value;
  } else {
    delete query[name];
  }

  if (name !== 'page') {
    query.page = '1';
  }

  router.push({ query });
}

async function loadProducts() {
  loading.value = true;
  error.value = '';

  try {
    const response = await getProducts(filters.value);
    products.value = response.items;
    if (response.meta) {
      meta.value = response.meta;
    }
  } catch (err) {
    error.value = getErrorMessage(err, 'Erro ao carregar produtos.');
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  try {
    categories.value = await getCategories();
  } catch {
    categories.value = [];
  }
});

watch(filters, loadProducts, { immediate: true });
</script>

<template>
  <div class="space-y-8">
    <section class="overflow-hidden rounded-[2.5rem] bg-slate-950 text-white shadow-soft">
      <div class="grid gap-6 px-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
        <div>
          <span class="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
            Catálogo Vue.js
          </span>
          <h1 class="mt-5 max-w-3xl text-4xl font-black tracking-[-0.05em] text-white md:text-5xl">
            A mesma API agora atende duas vitrines: React e Vue.
          </h1>
          <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Filtre, navegue e acesse o painel administrativo usando uma implementação paralela em Vue 3.
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div class="rounded-[2rem] bg-white/10 p-5">
            <span class="text-xs uppercase tracking-[0.2em] text-white/65">Vue 3</span>
            <h3 class="mt-2 text-2xl font-black tracking-[-0.03em]">Composable auth</h3>
          </div>
          <div class="rounded-[2rem] bg-emerald-400 p-5 text-slate-950">
            <span class="text-xs uppercase tracking-[0.2em] text-slate-800/70">Docker</span>
            <h3 class="mt-2 text-2xl font-black tracking-[-0.03em]">Dois frontends</h3>
          </div>
          <div class="rounded-[2rem] bg-[#f2b766] p-5 text-slate-950">
            <span class="text-xs uppercase tracking-[0.2em] text-slate-700/70">API</span>
            <h3 class="mt-2 text-2xl font-black tracking-[-0.03em]">Mesmo backend</h3>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div class="rounded-[2.5rem] bg-white p-6 shadow-soft">
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Coleções em destaque</p>
        <div class="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div class="rounded-[2rem] bg-[#f4efe6] p-5">
            <span class="text-xs uppercase tracking-[0.2em] text-slate-500">Essenciais</span>
            <h3 class="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">Modelos versáteis</h3>
          </div>
          <div class="rounded-[2rem] bg-emerald-500 p-5 text-white">
            <span class="text-xs uppercase tracking-[0.2em] text-white/70">Lançamentos</span>
            <h3 class="mt-2 text-2xl font-black tracking-[-0.03em]">Novos pares toda semana</h3>
          </div>
          <div class="rounded-[2rem] bg-[#d5f5e8] p-5">
            <span class="text-xs uppercase tracking-[0.2em] text-slate-700/70">Seleção</span>
            <h3 class="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">Preço e estilo</h3>
          </div>
        </div>
      </div>

      <div class="rounded-[2.5rem] border border-[#ece5da] bg-[#fffdf9] p-6 shadow-soft">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Catálogo</p>
            <h2 class="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">Encontre o produto ideal</h2>
          </div>
          <div class="rounded-full bg-[#f4efe6] px-4 py-2 text-sm text-slate-600">{{ meta.total }} produtos encontrados</div>
        </div>

        <div class="mt-6 grid gap-4 lg:grid-cols-4">
          <label class="lg:col-span-2">
            <span class="mb-2 block text-sm font-medium text-slate-700">Buscar produto</span>
            <input
              :value="filters.search"
              placeholder="Ex.: tênis casual"
              class="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              @input="updateFilter('search', ($event.target as HTMLInputElement).value)"
            />
          </label>

          <label>
            <span class="mb-2 block text-sm font-medium text-slate-700">Categoria</span>
            <select
              :value="filters.category"
              class="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              @change="updateFilter('category', ($event.target as HTMLSelectElement).value)"
            >
              <option value="">Todas</option>
              <option v-for="category in categories" :key="category.id" :value="String(category.id)">
                {{ category.name }}
              </option>
            </select>
          </label>

          <label>
            <span class="mb-2 block text-sm font-medium text-slate-700">Ordenação</span>
            <select
              :value="`${filters.sort}:${filters.direction}`"
              class="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              @change="handleSortChange(($event.target as HTMLSelectElement).value)"
            >
              <option value="created_at:desc">Mais recentes</option>
              <option value="name:asc">Nome A-Z</option>
              <option value="name:desc">Nome Z-A</option>
              <option value="price:asc">Menor preço</option>
              <option value="price:desc">Maior preço</option>
            </select>
          </label>
        </div>
      </div>
    </section>

    <section class="space-y-6 rounded-[2.5rem] border border-[#ece5da] bg-white p-6 shadow-soft">
      <div v-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ error }}
      </div>

      <div v-if="loading" class="rounded-[2rem] bg-[#fffdf9] px-6 py-16 text-center text-sm text-slate-500">
        Carregando catálogo...
      </div>
      <div v-else-if="products.length === 0" class="rounded-[2rem] bg-[#fffdf9] px-6 py-16 text-center">
        <h3 class="text-2xl font-black tracking-[-0.03em] text-slate-950">Nenhum produto encontrado</h3>
        <p class="mt-3 text-sm text-slate-500">Tente alterar a busca ou o filtro selecionado.</p>
      </div>
      <template v-else>
        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <RouterLink
            v-for="product in products"
            :key="product.id"
            :to="`/products/${product.id}`"
            class="group overflow-hidden rounded-[2rem] border border-[#ece5da] bg-[#fffdf9] transition hover:-translate-y-1 hover:shadow-soft"
          >
            <div class="aspect-[4/3] overflow-hidden bg-[#f4efe6]">
              <img v-if="product.image_url" :src="product.image_url" :alt="product.name" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div v-else class="flex h-full items-center justify-center text-slate-400">Sem imagem</div>
            </div>
            <div class="space-y-3 p-5">
              <div class="flex items-center justify-between gap-3">
                <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {{ product.category?.name || 'Sem categoria' }}
                </span>
                <span class="text-sm text-slate-400">#{{ product.id }}</span>
              </div>
              <h3 class="text-2xl font-black tracking-[-0.03em] text-slate-950">{{ product.name }}</h3>
              <p class="line-clamp-2 text-sm leading-6 text-slate-500">
                {{ product.description || 'Produto sem descrição cadastrada.' }}
              </p>
              <div class="flex items-center justify-between">
                <strong class="text-2xl font-black tracking-[-0.03em] text-emerald-700">{{ formatPrice(product.price) }}</strong>
                <span class="text-sm font-medium text-slate-600">Ver detalhe</span>
              </div>
            </div>
          </RouterLink>
        </div>

        <div v-if="meta.last_page > 1" class="flex flex-wrap items-center justify-center gap-2">
          <button
            v-for="page in meta.last_page"
            :key="page"
            type="button"
            :class="[
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              page === meta.current_page ? 'bg-slate-950 text-white' : 'bg-[#f4efe6] text-slate-700 hover:bg-[#ece3d2]'
            ]"
            @click="updateFilter('page', String(page))"
          >
            {{ page }}
          </button>
        </div>
      </template>
    </section>
  </div>
</template>
