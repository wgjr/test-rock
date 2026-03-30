import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../api/categories';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../api/products';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { Input } from '../components/Input';
import { LoadingState } from '../components/LoadingState';
import type { Category } from '../types/category';
import type { Product } from '../types/product';
import { getErrorMessage } from '../utils/error';
import { formatPrice } from '../utils/formatPrice';

type ProductFormState = {
  id?: number;
  name: string;
  description: string;
  price: string;
  category_id: string;
  image_url: string;
};

const initialProductForm: ProductFormState = {
  name: '',
  description: '',
  price: '',
  category_id: '',
  image_url: '',
};

export function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>(initialProductForm);
  const [submittingCategory, setSubmittingCategory] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [productPage, setProductPage] = useState(1);
  const [productTotalPages, setProductTotalPages] = useState(1);
  const [productTotal, setProductTotal] = useState(0);

  const sortedProducts = useMemo(() => [...products].sort((a, b) => b.id - a.id), [products]);

  async function loadData(page = productPage) {
    setLoading(true);
    setError('');

    try {
      const [loadedCategories, loadedProducts] = await Promise.all([
        getCategories(),
        getProducts({
          page,
          per_page: 20,
          sort: 'created_at',
          direction: 'desc',
        }),
      ]);
      setCategories(loadedCategories);
      setProducts(loadedProducts.items);
      const meta = loadedProducts.meta;
      setProductTotalPages(meta?.last_page ?? 1);
      setProductTotal(meta?.total ?? loadedProducts.items.length);
      setProductPage(page);
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível carregar a área administrativa.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData(1);
  }, []);

  function resetMessages() {
    setError('');
    setSuccess('');
  }

  async function handleCategorySubmit(event: FormEvent) {
    event.preventDefault();
    resetMessages();
    setSubmittingCategory(true);

    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, categoryName);
        setSuccess('Categoria atualizada com sucesso.');
      } else {
        await createCategory(categoryName);
        setSuccess('Categoria criada com sucesso.');
      }
      setCategoryName('');
      setEditingCategoryId(null);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível salvar a categoria.'));
    } finally {
      setSubmittingCategory(false);
    }
  }

  async function handleDeleteCategory(id: number) {
    resetMessages();

    const category = categories.find((c) => c.id === id);
    const productCount = products.filter((p) => p.category?.id === id).length;
    const message =
      productCount > 0
        ? `Excluir "${category?.name}"? Isso também removerá ${productCount} produto(s) vinculado(s) visíveis nesta página e todos os demais produtos desta categoria no servidor. Esta ação não pode ser desfeita.`
        : `Excluir a categoria "${category?.name}"? Se existirem produtos nesta categoria, eles serão removidos em cascata. Esta ação não pode ser desfeita.`;

    if (!window.confirm(message)) {
      return;
    }

    try {
      await deleteCategory(id);
      setSuccess('Categoria removida com sucesso.');
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível remover a categoria.'));
    }
  }

  async function handleProductSubmit(event: FormEvent) {
    event.preventDefault();
    resetMessages();
    setSubmittingProduct(true);

    try {
      const payload = {
        name: productForm.name,
        description: productForm.description || undefined,
        price: Number(productForm.price),
        category_id: Number(productForm.category_id),
        image_url: productForm.image_url || undefined,
      };

      if (productForm.id) {
        await updateProduct(productForm.id, payload);
        setSuccess('Produto atualizado com sucesso.');
      } else {
        await createProduct(payload);
        setSuccess('Produto criado com sucesso.');
      }

      setProductForm(initialProductForm);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível salvar o produto.'));
    } finally {
      setSubmittingProduct(false);
    }
  }

  async function handleDeleteProduct(id: number) {
    resetMessages();

    const product = products.find((p) => p.id === id);
    if (
      !window.confirm(
        `Excluir o produto "${product?.name ?? '#' + id}"? Esta ação não pode ser desfeita.`,
      )
    ) {
      return;
    }

    try {
      await deleteProduct(id);
      setSuccess('Produto removido com sucesso.');
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível remover o produto.'));
    }
  }

  if (loading) {
    return <LoadingState text="Carregando área administrativa..." />;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 to-brand-900 p-8 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Área protegida</p>
        <h1 className="mt-3 text-3xl font-bold">CRUD de categorias e produtos com Bearer token</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-200">
          Esta tela usa os endpoints protegidos do backend para criação, edição e exclusão. O token salvo no login é enviado automaticamente nas requisições.
        </p>
      </section>

      {error ? <Alert text={error} /> : null}
      {success ? <Alert text={success} tone="success" /> : null}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Categorias</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Gerenciar categorias</h2>
              </div>
              {editingCategoryId ? (
                <button
                  onClick={() => {
                    setEditingCategoryId(null);
                    setCategoryName('');
                  }}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Cancelar edição
                </button>
              ) : null}
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <Input
                label="Nome da categoria"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" loading={submittingCategory}>
                {editingCategoryId ? 'Salvar categoria' : 'Criar categoria'}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              {categories.length === 0 ? (
                <EmptyState title="Sem categorias" description="Crie a primeira categoria para começar." />
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4">
                    <div>
                      <p className="font-semibold text-slate-900">{category.name}</p>
                      <p className="text-sm text-slate-500">ID #{category.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          setEditingCategoryId(category.id);
                          setCategoryName(category.name);
                        }}
                      >
                        Editar
                      </Button>
                      <Button variant="danger" type="button" onClick={() => handleDeleteCategory(category.id)}>
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Produtos</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Criar e editar produtos</h2>
              </div>
              {productForm.id ? (
                <button
                  onClick={() => setProductForm(initialProductForm)}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Cancelar edição
                </button>
              ) : null}
            </div>

            <form onSubmit={handleProductSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  label="Nome"
                  value={productForm.name}
                  onChange={(e) => setProductForm((current) => ({ ...current, name: e.target.value }))}
                  required
                />
              </div>

              <label className="block space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Descrição</span>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm((current) => ({ ...current, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                />
              </label>

              <Input
                label="Preço"
                type="number"
                step="0.01"
                min="0"
                value={productForm.price}
                onChange={(e) => setProductForm((current) => ({ ...current, price: e.target.value }))}
                required
              />

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Categoria</span>
                <select
                  value={productForm.category_id}
                  onChange={(e) => setProductForm((current) => ({ ...current, category_id: e.target.value }))}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                >
                  <option value="">Selecione</option>
                  {categories.map((category) => (
                    <option key={category.id} value={String(category.id)}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="md:col-span-2">
                <Input
                  label="URL da imagem"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm((current) => ({ ...current, image_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div className="md:col-span-2">
                <Button type="submit" className="w-full" loading={submittingProduct}>
                  {productForm.id ? 'Salvar produto' : 'Criar produto'}
                </Button>
              </div>
            </form>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Produtos cadastrados</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Lista rápida para manutenção</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                {productTotal} produto{productTotal === 1 ? '' : 's'}
                {productTotalPages > 1 ? ` · página ${productPage} de ${productTotalPages}` : ''}
              </span>
            </div>

            {sortedProducts.length === 0 ? (
              <EmptyState title="Sem produtos" description="Crie o primeiro produto para visualizar a lista aqui." />
            ) : (
              <div className="space-y-3">
                {productTotalPages > 1 ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={productPage <= 1}
                      onClick={() => loadData(productPage - 1)}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm text-slate-600">
                      Página {productPage} de {productTotalPages}
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={productPage >= productTotalPages}
                      onClick={() => loadData(productPage + 1)}
                    >
                      Próxima
                    </Button>
                  </div>
                ) : null}
                {sortedProducts.map((product) => (
                  <div key={product.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                            {product.category?.name}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">{product.description || 'Sem descrição.'}</p>
                        <p className="text-sm font-semibold text-slate-900">{formatPrice(product.price)}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() =>
                            setProductForm({
                              id: product.id,
                              name: product.name,
                              description: product.description || '',
                              price: product.price,
                              category_id: String(product.category?.id || ''),
                              image_url: product.image_url || '',
                            })
                          }
                        >
                          Editar
                        </Button>
                        <Button variant="danger" type="button" onClick={() => handleDeleteProduct(product.id)}>
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
