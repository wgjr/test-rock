import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../utils/error';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = (location.state as { from?: string } | undefined)?.from ?? '/admin';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Falha ao realizar login.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[2.5rem] bg-[#6f57ff] p-8 text-white shadow-soft lg:p-10">
        <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
          Minha conta
        </span>
        <h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em]">Entre para acompanhar seus pedidos e gerenciar o catálogo.</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-white/80">
          Acesse sua área com uma experiência mais alinhada ao contexto de loja, mantendo integração completa com a autenticação existente.
        </p>
      </div>

      <div className="mx-auto w-full max-w-xl rounded-[2.5rem] border border-[#ece5da] bg-white p-8 shadow-soft lg:p-10">
        <div className="mb-8 space-y-2 text-center">
          <span className="inline-flex rounded-full bg-[#f4efe6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
            Entrar
          </span>
          <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950">Acesse sua conta</h2>
          <p className="text-sm text-slate-500">Use seu e-mail e senha para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error ? <Alert text={error} /> : null}
          <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full" loading={loading}>
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Ainda não tem conta?{' '}
          <Link to="/register" className="font-semibold text-brand-700">
            Criar cadastro
          </Link>
        </p>
      </div>
    </section>
  );
}
