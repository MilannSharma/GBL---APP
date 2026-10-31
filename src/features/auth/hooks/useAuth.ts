import { useState, useCallback } from 'react';
import { storage } from '@/core/storage';
import { authApi } from '../api';
import { logger } from '@/core/logger';
import { AppError } from '@/api/errors';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithCredentials = useCallback(
    async (identifier: string, password: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const cleanIdentifier = identifier.trim();
        const isNumericPhone = /^\d{10}$/.test(cleanIdentifier);

        const payload = isNumericPhone
          ? { contact: Number(cleanIdentifier), password }
          : { username: cleanIdentifier, password };

        // Production-grade: Live API authentication only. Zero mock fallbacks.
        const responseData = await authApi.loginAgent(payload);

        if (responseData?.token) {
          await storage.setItem(storage.keys.AUTH_TOKEN, responseData.token);
          if (responseData.refreshToken) {
            await storage.setItem(storage.keys.REFRESH_TOKEN, responseData.refreshToken);
          }
          if (responseData.account) {
            // Already stripped of the password hash by the login schema.
            await storage.setItem(storage.keys.USER_PROFILE, JSON.stringify(responseData.account));
          }
          return true;
        }

        setError('Authentication failed. No token received from server.');
        return false;
      } catch (err: unknown) {
        // User-friendly messages only — never expose backend error details
        let message = 'Incorrect credentials. Please try again.';

        if (err instanceof AppError) {
          if (err.code === 'NETWORK_ERROR') {
            message = 'Unable to connect. Please check your internet connection.';
          } else if (err.code === 'FORBIDDEN') {
            message = 'Account is inactive. Please contact support.';
          }
          // All other codes (UNAUTHORIZED, NOT_FOUND, VALIDATION_ERROR, etc.)
          // keep the default friendly message — no backend details leaked
        }

        setError(message);
        // Use warn instead of error to avoid the red Metro error toast
        logger.warn('Login failed', { code: err instanceof AppError ? err.code : 'UNKNOWN' });
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const logout = useCallback(async () => {
    await storage.removeItem(storage.keys.AUTH_TOKEN);
    await storage.removeItem(storage.keys.REFRESH_TOKEN);
    await storage.removeItem(storage.keys.USER_PROFILE);
  }, []);

  return {
    loading,
    error,
    clearError,
    loginWithCredentials,
    logout,
  };
}
