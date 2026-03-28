import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
}
