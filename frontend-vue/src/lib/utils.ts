import axios from 'axios';

export function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    const errors = error.response?.data?.errors;
    if (errors && typeof errors === 'object') {
      const firstGroup = Object.values(errors)[0];
      if (Array.isArray(firstGroup) && firstGroup[0]) {
        return String(firstGroup[0]);
      }
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
