import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../utils/error';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register({ name, email, password, password_confirmation: passwordConfirmation });
      setSuccess('Cadastro realizado com sucesso.');
      navigate('/login');
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível concluir o cadastro.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[2.5rem] bg-[#f4efe6] p-8 shadow-soft lg:p-10">
        <span className="inline-flex rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          Novo acesso
        </span>
        <h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950">Crie sua conta para acessar o painel e continuar comprando.</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
          Cadastro simples, fluxo direto e visual consistente com a experiência principal da loja.
        </p>
      </div>

      <div className="mx-auto w-full max-w-xl rounded-[2.5rem] border border-[#ece5da] bg-white p-8 shadow-soft lg:p-10">
        <div className="mb-8 space-y-2 text-center">
          <span className="inline-flex rounded-full bg-[#f4efe6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
            Cadastro
          </span>
          <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950">Crie sua conta</h2>
          <p className="text-sm text-slate-500">Preencha seus dados para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error ? <Alert text={error} /> : null}
          {success ? <Alert text={success} tone="success" /> : null}
          <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={12}
            autoComplete="new-password"
          />
          <p className="text-xs text-slate-500">Mínimo 12 caracteres, com letras maiúsculas e minúsculas e pelo menos um número.</p>
          <Input
            label="Confirmar senha"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            minLength={12}
            autoComplete="new-password"
          />
          <Button type="submit" className="w-full" loading={loading}>
            Criar conta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Já possui cadastro?{' '}
          <Link to="/login" className="font-semibold text-brand-700">
            Fazer login
          </Link>
        </p>
      </div>
    </section>
  );
}
