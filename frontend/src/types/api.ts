export type ApiMessageResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type ApiError = {
  message?: string;
  errors?: Record<string, string[]>;
};
