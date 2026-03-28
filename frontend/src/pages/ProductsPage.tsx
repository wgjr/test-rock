import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories } from '../api/categories';
import { getProducts } from '../api/products';
import { Alert } from '../components/Alert';
import { EmptyState } from '../components/EmptyState';
import { Hero } from '../components/Hero';
import { LoadingState } from '../components/LoadingState';
import { Pagination } from '../components/Pagination';
import { ProductCard } from '../components/ProductCard';
import type { Category } from '../types/category';
import type { Product } from '../types/product';
import { getErrorMessage } from '../utils/error';

const DEFAULT_PER_PAGE = 9;

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: DEFAULT_PER_PAGE, total: 0 });

  const filters = useMemo(
    () => ({
      page: Number(searchParams.get('page') || 1),
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      sort: (searchParams.get('sort') || 'created_at') as 'created_at' | 'name' | 'price',
      direction: (searchParams.get('direction') || 'desc') as 'asc' | 'desc',
      per_page: Number(searchParams.get('per_page') || DEFAULT_PER_PAGE),
    }),
    [searchParams],
  );

  useEffect(() => {
    getCategories().then(setCategories).catch(() => undefined);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');

    getProducts(filters)
      .then((response) => {
        setProducts(response.items);
        if (response.meta) {
          setMeta(response.meta);
        }
      })
      .catch((err) => setError(getErrorMessage(err, 'Erro ao carregar produtos.')))
      .finally(() => setLoading(false));
  }, [filters]);

  function updateFilter(name: string, value: string) {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(name, value);
    } else {
      next.delete(name);
    }

    if (name !== 'page') {
      next.set('page', '1');
    }

    setSearchParams(next);
  }

  return (
    <div className="space-y-8">
      <Hero />

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2.5rem] bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Coleções em destaque</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[2rem] bg-[#f4efe6] p-5">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Essenciais</span>
              <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">Modelos versáteis</h3>
            </div>
            <div className="rounded-[2rem] bg-[#6f57ff] p-5 text-white">
              <span className="text-xs uppercase tracking-[0.2em] text-white/70">Lançamentos</span>
              <h3 className="mt-2 text-2xl font-black tracking-[-0.03em]">Novos pares toda semana</h3>
            </div>
            <div className="rounded-[2rem] bg-[#f2b766] p-5">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-700/70">Seleção</span>
              <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">Preço e estilo</h3>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-[#ece5da] bg-[#fffdf9] p-6 shadow-soft">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Catálogo</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">Encontre o produto ideal</h2>
            </div>
            <div className="rounded-full bg-[#f4efe6] px-4 py-2 text-sm text-slate-600">{meta.total} produtos encontrados</div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            <label className="lg:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Buscar produto</span>
              <input
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Ex.: tênis casual"
                className="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700">Categoria</span>
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              >
                <option value="">Todas</option>
                {categories.map((category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700">Ordenação</span>
              <select
                value={`${filters.sort}:${filters.direction}`}
                onChange={(e) => {
                  const [sort, direction] = e.target.value.split(':');
                  updateFilter('sort', sort);
                  updateFilter('direction', direction);
                }}
                className="w-full rounded-2xl border border-[#e7dfd2] bg-white px-4 py-3 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              >
                <option value="created_at:desc">Mais recentes</option>
                <option value="name:asc">Nome A-Z</option>
                <option value="name:desc">Nome Z-A</option>
                <option value="price:asc">Menor preço</option>
                <option value="price:desc">Maior preço</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-[2.5rem] border border-[#ece5da] bg-white p-6 shadow-soft">
        {error ? <Alert text={error} /> : null}

        {loading ? (
          <LoadingState text="Carregando catálogo..." />
        ) : products.length === 0 ? (
          <EmptyState title="Nenhum produto encontrado" description="Tente alterar a busca ou o filtro selecionado." />
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              onPageChange={(page) => updateFilter('page', String(page))}
            />
          </>
        )}
      </section>
    </div>
  );
}
