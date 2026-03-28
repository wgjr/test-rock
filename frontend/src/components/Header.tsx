import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function navClassName(isActive: boolean) {
  return `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-slate-950 text-white shadow-soft'
      : 'text-slate-600 hover:bg-white hover:text-slate-950'
  }`;
}

export function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-[rgba(246,242,235,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black uppercase tracking-[0.2em] text-white">
              TF
            </div>
            <div>
              <strong className="block text-[11px] uppercase tracking-[0.35em] text-slate-400">Rocks</strong>
              <span className="text-lg font-semibold text-slate-950">Store</span>
            </div>
          </Link>
        </div>

        <nav className="flex flex-center items-center gap-2">
          <NavLink to="/" className={({ isActive }) => navClassName(isActive)} end>
            Novidades
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => navClassName(isActive)}>
            Painel
          </NavLink>
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={({ isActive }) => navClassName(isActive)}>
                Entrar
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => navClassName(isActive)}>
                Criar conta
              </NavLink>
            </>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-soft">
                {user?.name || user?.email || 'Minha conta'}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
              >
                Sair
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
