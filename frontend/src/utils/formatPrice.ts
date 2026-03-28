export function formatPrice(value: string | number) {
  const numericValue = typeof value === 'number' ? value : Number(value);

  /**
   * @todo implementar multi moedas, loja global
   */
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number.isNaN(numericValue) ? 0 : numericValue);
}
