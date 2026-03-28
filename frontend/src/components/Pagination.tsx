import { Button } from './Button';

export function Pagination({
  currentPage,
  lastPage,
  onPageChange,
}: {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}) {
  if (lastPage <= 1) {
    return null;
  }

  const pages = Array.from({ length: lastPage }, (_, index) => index + 1).slice(
    Math.max(0, currentPage - 3),
    Math.max(5, currentPage + 2),
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="secondary" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        Anterior
      </Button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`h-11 min-w-11 rounded-2xl px-4 font-medium transition ${
            currentPage === page ? 'bg-slate-950 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
          }`}
        >
          {page}
        </button>
      ))}
      <Button variant="secondary" disabled={currentPage === lastPage} onClick={() => onPageChange(currentPage + 1)}>
        Próxima
      </Button>
    </div>
  );
}
