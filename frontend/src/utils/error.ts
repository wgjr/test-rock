import axios from 'axios';
import type { ApiError } from '../types/api';

export function getErrorMessage(error: unknown, fallback = 'Não foi possível concluir a operação.') {
  if (axios.isAxiosError<ApiError>(error)) {
    const responseData = error.response?.data;

    if (responseData?.errors) {
      return Object.values(responseData.errors).flat().join(' ');
    }

    return responseData?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
