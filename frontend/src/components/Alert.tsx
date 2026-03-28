export function Alert({ text, tone = 'error' }: { text: string; tone?: 'error' | 'success' }) {
  const toneClasses = tone === 'success'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-rose-200 bg-rose-50 text-rose-700';

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClasses}`}>{text}</div>;
}
