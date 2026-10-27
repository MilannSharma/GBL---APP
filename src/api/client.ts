import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/core/config';
import { storage } from '@/core/storage';
import { AppError } from './errors';

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach Bearer Token
apiClient.interceptors.request.use(
  async (requestConfig: InternalAxiosRequestConfig) => {
    const token = await storage.getItem(storage.keys.AUTH_TOKEN);
    if (token && requestConfig.headers) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error: unknown) => Promise.reject(error)
);

// Response Interceptor: Error Transformation
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(
        new AppError('NETWORK_ERROR', 'Network unreachable. Operating in offline mode.')
      );
    }

    const { status, data } = error.response;
    const responseData = data as Record<string, unknown> | undefined;
    const message = (responseData?.message as string) || error.message || 'An error occurred';

    if (status === 401) {
      // Clear token and trigger logout if necessary
      await storage.removeItem(storage.keys.AUTH_TOKEN);
      return Promise.reject(new AppError('UNAUTHORIZED', message));
    }

    if (status === 403) {
      return Promise.reject(new AppError('FORBIDDEN', message));
    }

    if (status === 404) {
      return Promise.reject(new AppError('NOT_FOUND', message));
    }

    if (status >= 400 && status < 500) {
      return Promise.reject(new AppError('VALIDATION_ERROR', message, responseData));
    }

    if (status >= 500) {
      return Promise.reject(new AppError('SERVER_ERROR', 'Server error. Please try again later.'));
    }

    return Promise.reject(new AppError('UNKNOWN_ERROR', message));
  }
);
