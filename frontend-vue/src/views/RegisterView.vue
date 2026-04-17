<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../lib/auth';
import { getErrorMessage } from '../lib/utils';

const router = useRouter();
const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});
const error = ref('');
const success = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    await auth.register(form);
    success.value = 'Cadastro realizado com sucesso.';
    await router.push('/login');
  } catch (err) {
    error.value = getErrorMessage(err, 'Não foi possível concluir o cadastro.');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
    <div class="rounded-[2.5rem] bg-[#d5f5e8] p-8 shadow-soft lg:p-10">
      <span class="inline-flex rounded-full border border-emerald-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
        Novo acesso
      </span>
      <h1 class="mt-5 text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950">Crie sua conta para acessar o painel e continuar comprando.</h1>
      <p class="mt-4 max-w-md text-sm leading-7 text-slate-600">
        Implementação alternativa em Vue, mantendo o mesmo contrato de autenticação da API.
      </p>
    </div>

    <div class="mx-auto w-full max-w-xl rounded-[2.5rem] border border-[#ece5da] bg-white p-8 shadow-soft lg:p-10">
      <div class="mb-8 space-y-2 text-center">
        <span class="inline-flex rounded-full bg-[#d5f5e8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
          Cadastro
        </span>
        <h2 class="text-3xl font-black tracking-[-0.03em] text-slate-950">Crie sua conta</h2>
        <p class="text-sm text-slate-500">Preencha seus dados para continuar.</p>
      </div>

      <form class="space-y-5" @submit.prevent="submit">
        <div v-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {{ error }}
        </div>
        <div v-if="success" class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {{ success }}
        </div>
        <label class="block">
          <span class="mb-2 block text-sm font-medium text-slate-700">Nome</span>
          <input v-model="form.name" required class="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>
        <label class="block">
          <span class="mb-2 block text-sm font-medium text-slate-700">E-mail</span>
          <input v-model="form.email" type="email" required class="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>
        <label class="block">
          <span class="mb-2 block text-sm font-medium text-slate-700">Senha</span>
          <input v-model="form.password" type="password" minlength="12" required class="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>
        <p class="text-xs text-slate-500">Mínimo 12 caracteres, com letras maiúsculas e minúsculas e pelo menos um número.</p>
        <label class="block">
          <span class="mb-2 block text-sm font-medium text-slate-700">Confirmar senha</span>
          <input v-model="form.password_confirmation" type="password" minlength="12" required class="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>
        <button type="submit" class="w-full rounded-full bg-slate-950 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70" :disabled="loading">
          {{ loading ? 'Criando...' : 'Criar conta' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-500">
        Já possui cadastro?
        <RouterLink to="/login" class="font-semibold text-emerald-700">Fazer login</RouterLink>
      </p>
    </div>
  </section>
</template>
