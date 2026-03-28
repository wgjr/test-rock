import { Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { formatPrice } from '../utils/formatPrice';

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-[#ece5da] bg-[#fffdf9] shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f4efe6]">
        <div className="absolute left-4 top-4 z-10 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-soft">
          {product.category?.name ?? 'Coleção'}
        </div>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">Sem imagem</div>
        )}
      </div>
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-6 text-slate-950">{product.name}</h3>
            <span className="whitespace-nowrap text-lg font-black text-slate-950">{formatPrice(product.price)}</span>
          </div>
          <p className="min-h-10 text-sm leading-6 text-slate-500">{product.description || 'Produto sem descrição.'}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Ver mais detalhes</span>
          <Link
            to={`/products/${product.id}`}
            className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Abrir
          </Link>
        </div>
      </div>
    </article>
  );
}
