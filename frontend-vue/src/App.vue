<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from './lib/auth';

const router = useRouter();
const userLabel = computed(() => auth.state.user?.name || auth.state.user?.email || 'Minha conta');
const isAuthenticated = auth.isAuthenticated;

function linkClass(isActive: boolean) {
  return isActive
    ? 'bg-slate-950 text-white shadow-soft'
    : 'text-slate-600 hover:bg-white hover:text-slate-950';
}

function logout() {
  auth.logout();
  router.push('/');
}
</script>

<template>
  <div class="min-h-screen bg-transparent text-slate-900">
    <header class="sticky top-0 z-20 border-b border-white/70 bg-[rgba(246,242,235,0.82)] backdrop-blur-xl">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div class="flex items-center justify-between gap-3">
          <RouterLink to="/" class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-black uppercase tracking-[0.2em] text-white">
              VF
            </div>
            <div>
              <strong class="block text-[11px] uppercase tracking-[0.35em] text-slate-400">Rocks</strong>
              <span class="text-lg font-semibold text-slate-950">Vue Store</span>
            </div>
          </RouterLink>
        </div>

        <nav class="flex flex-wrap items-center gap-2">
          <RouterLink v-slot="{ isActive }" to="/">
            <span :class="['rounded-full px-4 py-2 text-sm font-medium transition', linkClass(isActive)]">Novidades</span>
          </RouterLink>
          <RouterLink v-if="auth.state.user?.role === 'admin'" v-slot="{ isActive }" to="/admin">
            <span :class="['rounded-full px-4 py-2 text-sm font-medium transition', linkClass(isActive)]">Painel</span>
          </RouterLink>
          <template v-if="!isAuthenticated">
            <RouterLink v-slot="{ isActive }" to="/login">
              <span :class="['rounded-full px-4 py-2 text-sm font-medium transition', linkClass(isActive)]">Entrar</span>
            </RouterLink>
            <RouterLink v-slot="{ isActive }" to="/register">
              <span :class="['rounded-full px-4 py-2 text-sm font-medium transition', linkClass(isActive)]">Criar conta</span>
            </RouterLink>
          </template>
          <template v-else>
            <span class="rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-soft">
              {{ userLabel }}
            </span>
            <button
              type="button"
              class="rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
              @click="logout"
            >
              Sair
            </button>
          </template>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-10">
      <RouterView />
    </main>
  </div>
</template>
