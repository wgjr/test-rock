<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { auth } from '../lib/auth';
import { getErrorMessage } from '../lib/utils';

const router = useRouter();
const route = useRoute();
const form = reactive({
  email: '',
  password: '',
});
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;

  try {
    await auth.login(form);
    await router.replace(String(route.query.redirect || '/admin'));
  } catch (err) {
    error.value = getErrorMessage(err, 'Falha ao realizar login.');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
    <div class="rounded-[2.5rem] bg-emerald-600 p-8 text-white shadow-soft lg:p-10">
      <span class="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
        Minha conta
      </span>
      <h1 class="mt-5 text-4xl font-black leading-tight tracking-[-0.04em]">Entre para acompanhar seus pedidos e gerenciar o catálogo.</h1>
      <p class="mt-4 max-w-md text-sm leading-7 text-white/80">
        O fluxo usa o mesmo backend e o mesmo token Bearer do frontend React.
      </p>
    </div>

    <div class="mx-auto w-full max-w-xl rounded-[2.5rem] border border-[#ece5da] bg-white p-8 shadow-soft lg:p-10">
      <div class="mb-8 space-y-2 text-center">
        <span class="inline-flex rounded-full bg-[#d5f5e8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
          Entrar
        </span>
        <h2 class="text-3xl font-black tracking-[-0.03em] text-slate-950">Acesse sua conta</h2>
        <p class="text-sm text-slate-500">Use seu e-mail e senha para continuar.</p>
      </div>

      <form class="space-y-5" @submit.prevent="submit">
        <div v-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {{ error }}
        </div>
        <label class="block">
          <span class="mb-2 block text-sm font-medium text-slate-700">E-mail</span>
          <input v-model="form.email" type="email" required class="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>
        <label class="block">
          <span class="mb-2 block text-sm font-medium text-slate-700">Senha</span>
          <input v-model="form.password" type="password" required class="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>
        <button type="submit" class="w-full rounded-full bg-slate-950 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500">
        Ainda não tem conta?
        <RouterLink to="/register" class="font-semibold text-emerald-700">Criar cadastro</RouterLink>
      </p>
    </div>
  </section>
</template>
