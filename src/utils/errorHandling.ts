// Error handling utilities
export class AppError extends Error {
  statusCode?: number;
  code?: string;

  constructor(
    message: string,
    statusCode?: number,
    code?: string
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof Error && error.message.includes('fetch');
};

export const isAuthError = (error: unknown): boolean => {
  return error instanceof AppError && error.statusCode === 401;
};