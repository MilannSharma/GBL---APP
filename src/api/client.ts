import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/core/config';
import { storage } from '@/core/storage';
import { AppError } from './errors';
import { notifyUnauthorized } from './session';

/** Nest answers `{ statusCode, message, error }`; `message` is a string[] for DTO validation errors. */
function extractMessage(body: Record<string, unknown> | undefined): string | undefined {
  const raw = body?.message ?? body?.error ?? body?.msg;
  if (Array.isArray(raw)) {
    return raw.filter((item): item is string => typeof item === 'string').join('\n') || undefined;
  }
  return typeof raw === 'string' ? raw : undefined;
}

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
    const message = extractMessage(responseData) || error.message || 'An error occurred';

    if (status === 401) {
      // The token is dead: wipe the session and send the user back to login.
      await storage.removeItem(storage.keys.AUTH_TOKEN);
      await storage.removeItem(storage.keys.REFRESH_TOKEN);
      await storage.removeItem(storage.keys.USER_PROFILE);
      notifyUnauthorized();
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
      const serverMessage = (responseData?.message as string) || (responseData?.error as string) || 'Server error. Please try again later.';
      return Promise.reject(
        new AppError('SERVER_ERROR', serverMessage, {
          status,
          body: typeof data === 'string' ? data.slice(0, 300) : data,
        })
      );
    }

    return Promise.reject(new AppError('UNKNOWN_ERROR', message));
  }
);
