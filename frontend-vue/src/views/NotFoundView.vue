<template>
  <section class="rounded-[2.5rem] border border-[#ece5da] bg-white px-6 py-16 text-center shadow-soft">
    <span class="inline-flex rounded-full bg-[#d5f5e8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
      404
    </span>
    <h1 class="mt-5 text-4xl font-black tracking-[-0.04em] text-slate-950">Página não encontrada</h1>
    <p class="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
      A rota solicitada não existe nesta implementação em Vue. Volte para o catálogo principal.
    </p>
    <RouterLink to="/" class="mt-8 inline-flex rounded-full bg-slate-950 px-5 py-3 font-medium text-white transition hover:bg-slate-800">
      Ir para a home
    </RouterLink>
  </section>
</template>
