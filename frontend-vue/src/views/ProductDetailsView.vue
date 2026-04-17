<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getProductById } from '../lib/api';
import { formatPrice, getErrorMessage } from '../lib/utils';
import type { Product } from '../lib/types';

const route = useRoute();
const product = ref<Product | null>(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    product.value = await getProductById(String(route.params.id));
  } catch (err) {
    error.value = getErrorMessage(err, 'Erro ao carregar detalhes do produto.');
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading" class="rounded-[2rem] bg-white px-6 py-16 text-center text-sm text-slate-500 shadow-soft">
    Carregando detalhes do produto...
  </div>
  <div v-else-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
    {{ error }}
  </div>
  <div v-else-if="!product" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
    Produto não encontrado.
  </div>
  <section v-else class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
    <div class="overflow-hidden rounded-[2.5rem] bg-[#f4efe6] shadow-soft">
      <img v-if="product.image_url" :src="product.image_url" :alt="product.name" class="h-full w-full object-cover" />
      <div v-else class="flex min-h-[460px] items-center justify-center text-slate-400">Sem imagem</div>
    </div>

    <div class="space-y-6 rounded-[2.5rem] border border-[#ece5da] bg-white p-6 shadow-soft lg:p-8">
      <div class="flex flex-wrap items-center gap-3">
        <span class="rounded-full bg-[#d5f5e8] px-4 py-2 text-sm font-semibold text-emerald-900">
          {{ product.category?.name ?? 'Sem categoria' }}
        </span>
        <span class="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-500">Produto #{{ product.id }}</span>
      </div>

      <div>
        <h1 class="text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950">{{ product.name }}</h1>
        <p class="mt-4 text-base leading-7 text-slate-600">
          {{ product.description || 'Este produto não possui descrição cadastrada.' }}
        </p>
      </div>

      <div class="rounded-[2rem] bg-emerald-600 p-6 text-white">
        <p class="text-sm uppercase tracking-[0.2em] text-white/70">Preço</p>
        <strong class="mt-3 block text-5xl font-black tracking-[-0.04em]">{{ formatPrice(product.price) }}</strong>
        <p class="mt-3 text-sm text-white/80">Entrega rápida, política de troca facilitada e checkout seguro.</p>
      </div>

      <dl class="grid gap-4 rounded-[2rem] border border-[#ece5da] p-5 sm:grid-cols-2">
        <div>
          <dt class="text-sm text-slate-500">Criado em</dt>
          <dd class="mt-1 font-medium text-slate-900">{{ new Date(product.created_at).toLocaleString('pt-BR') }}</dd>
        </div>
        <div>
          <dt class="text-sm text-slate-500">Atualizado em</dt>
          <dd class="mt-1 font-medium text-slate-900">{{ new Date(product.updated_at).toLocaleString('pt-BR') }}</dd>
        </div>
      </dl>

      <div class="flex flex-wrap gap-3">
        <RouterLink to="/" class="inline-flex rounded-full bg-slate-950 px-5 py-3 font-medium text-white transition hover:bg-slate-800">
          Voltar ao catálogo
        </RouterLink>
        <RouterLink to="/login" class="inline-flex rounded-full bg-[#f4efe6] px-5 py-3 font-medium text-slate-700 transition hover:bg-[#ece3d2]">
          Entrar para comprar
        </RouterLink>
      </div>
    </div>
  </section>
</template>
