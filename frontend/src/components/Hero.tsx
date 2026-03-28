export function Hero() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#f4efe6] p-8 shadow-soft lg:p-10">
        <div className="absolute -left-10 top-16 h-40 w-40 rounded-full bg-[#d9ab54] blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[#e2c37e] blur-3xl opacity-70" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-flex rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
            Novos Produtos
          </span>

          <div className="space-y-3">
            <h1 className="max-w-xl text-4xl font-black leading-none tracking-[-0.04em] text-slate-950 lg:text-6xl">
              Encontre o produto que busca
            </h1>
            <p className="max-w-lg text-base leading-7 text-slate-600">
              Catálogo com busca, filtros e navegação fluida para explorar lançamentos, mais vendidos e produtos em destaque.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-slate-950 px-5 py-3 font-medium text-white">Frete grátis acima de R$ 299</span>
            <span className="rounded-full bg-white px-5 py-3 font-medium text-slate-700 shadow-soft">Troca fácil em até 7 dias</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="overflow-hidden rounded-[2.5rem] bg-[#6f57ff] p-7 text-white shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">Campanha da semana</p>
          <h2 className="mt-4 max-w-xs text-3xl font-black leading-tight tracking-[-0.03em]">
            O melhor preço do mercado
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
            Descubra o melhor produto, com o melhor valor do mercado
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Categorias</p>
            <strong className="mt-3 block text-2xl text-slate-950">Explore</strong>
          </div>
          <div className="rounded-[2rem] bg-[#f2b766] p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-700/70">Seleção</p>
            <strong className="mt-3 block text-2xl text-slate-950">Destaques</strong>
          </div>
          <div className="rounded-[2rem] bg-white p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Novidades</p>
            <strong className="mt-3 block text-2xl text-slate-950">Toda semana</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
