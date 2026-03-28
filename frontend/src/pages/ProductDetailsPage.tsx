import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductById } from '../api/products';
import { Alert } from '../components/Alert';
import { LoadingState } from '../components/LoadingState';
import type { Product } from '../types/product';
import { getErrorMessage } from '../utils/error';
import { formatPrice } from '../utils/formatPrice';

export function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      return;
    }

    setLoading(true);
    getProductById(id)
      .then(setProduct)
      .catch((err) => setError(getErrorMessage(err, 'Erro ao carregar detalhes do produto.')))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <LoadingState text="Carregando detalhes do produto..." />;
  }

  if (error) {
    return <Alert text={error} />;
  }

  if (!product) {
    return <Alert text="Produto não encontrado." />;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="overflow-hidden rounded-[2.5rem] bg-[#f4efe6] shadow-soft">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex min-h-[460px] items-center justify-center text-slate-400">Sem imagem</div>
        )}
      </div>

      <div className="space-y-6 rounded-[2.5rem] border border-[#ece5da] bg-white p-6 shadow-soft lg:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#f4efe6] px-4 py-2 text-sm font-semibold text-slate-700">
            {product.category?.name ?? 'Sem categoria'}
          </span>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-500">Produto #{product.id}</span>
        </div>

        <div>
          <h1 className="text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950">{product.name}</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {product.description || 'Este produto não possui descrição cadastrada.'}
          </p>
        </div>

        <div className="rounded-[2rem] bg-[#6f57ff] p-6 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Preço</p>
          <strong className="mt-3 block text-5xl font-black tracking-[-0.04em]">{formatPrice(product.price)}</strong>
          <p className="mt-3 text-sm text-white/80">Entrega rápida, política de troca facilitada e checkout seguro.</p>
        </div>

        <dl className="grid gap-4 rounded-[2rem] border border-[#ece5da] p-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500">Criado em</dt>
            <dd className="mt-1 font-medium text-slate-900">{new Date(product.created_at).toLocaleString('pt-BR')}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Atualizado em</dt>
            <dd className="mt-1 font-medium text-slate-900">{new Date(product.updated_at).toLocaleString('pt-BR')}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-3">
          <Link to="/" className="inline-flex rounded-full bg-slate-950 px-5 py-3 font-medium text-white transition hover:bg-slate-800">
            Voltar ao catálogo
          </Link>
          <Link to="/login" className="inline-flex rounded-full bg-[#f4efe6] px-5 py-3 font-medium text-slate-700 transition hover:bg-[#ece3d2]">
            Entrar para comprar
          </Link>
        </div>
      </div>
    </section>
  );
}
