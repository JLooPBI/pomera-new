// lib/utils/error-handler.ts

import { toast } from 'react-hot-toast';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export interface ErrorResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  options?: {
    errorMessage?: string;
    showToast?: boolean;
    onError?: (error: any) => void;
  }
): Promise<ErrorResponse<T>> {
  try {
    const data = await operation();
    return { data };
  } catch (error: any) {
    console.error('Operation failed:', error);
    
    const errorMessage = options?.errorMessage || error.message || 'An unexpected error occurred';
    
    if (options?.showToast !== false) {
      toast.error(errorMessage);
    }
    
    if (options?.onError) {
      options.onError(error);
    }
    
    return {
      error: {
        message: errorMessage,
        code: error.code,
        details: error.details
      }
    };
  }
}

export function handleSupabaseError(error: any): string {
  if (error.code === '23505') {
    return 'This record already exists';
  }
  if (error.code === '23503') {
    return 'Cannot delete this record as it is referenced by other data';
  }
  if (error.code === '42501') {
    return 'You do not have permission to perform this action';
  }
  if (error.code === 'PGRST116') {
    return 'Record not found';
  }
  return error.message || 'Database operation failed';
}