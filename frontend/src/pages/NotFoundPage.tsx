import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">404</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">Página não encontrada</h1>
      <p className="mt-2 text-slate-500">A rota que você tentou acessar não existe.</p>
      <Link to="/" className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 font-medium text-white">
        Voltar ao catálogo
      </Link>
    </div>
  );
}
