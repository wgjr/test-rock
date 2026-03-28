export function LoadingState({ text = 'Carregando...' }: { text?: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-soft">
      {text}
    </div>
  );
}
