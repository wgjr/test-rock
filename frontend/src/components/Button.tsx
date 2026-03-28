import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
};

const variants = {
  primary: 'bg-slate-950 text-white hover:bg-slate-800',
  secondary: 'bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50',
  danger: 'bg-rose-600 text-white hover:bg-rose-500',
};

export function Button({ loading, children, className = '', variant = 'primary', ...props }: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
}
