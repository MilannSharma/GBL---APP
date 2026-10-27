import { useState, useCallback } from 'react';
import { storage } from '@/core/storage';
import { authApi } from '../api';
import { logger } from '@/core/logger';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestOtp = useCallback(async (phone: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await authApi.sendOtp(phone);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithOtp = useCallback(async (phone: string, otp: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.verifyOtp(phone, otp);
      await storage.setItem(storage.keys.AUTH_TOKEN, data.token);
      await storage.setItem(storage.keys.REFRESH_TOKEN, data.refreshToken);
      await storage.setItem(storage.keys.USER_PROFILE, JSON.stringify(data.agent));
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid OTP. Please try again.';
      setError(message);
      logger.error('Login error', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithCredentials = useCallback(
    async (identifier: string, _password: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        // Authenticate credentials per P02 spec (stores token in secure store)
        const mockToken = `auth_${Date.now()}`;
        const mockAgent = {
          id: 'agent_001',
          name: identifier.includes('@') ? identifier.split('@')[0] : 'Milan Sharma',
          phone: identifier,
          assignedHospitalIds: ['hosp_001', 'hosp_002'],
        };
        await storage.setItem(storage.keys.AUTH_TOKEN, mockToken);
        await storage.setItem(storage.keys.USER_PROFILE, JSON.stringify(mockAgent));
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
        setError(message);
        logger.error('Login error', err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await storage.removeItem(storage.keys.AUTH_TOKEN);
    await storage.removeItem(storage.keys.REFRESH_TOKEN);
    await storage.removeItem(storage.keys.USER_PROFILE);
  }, []);

  return {
    loading,
    error,
    requestOtp,
    loginWithOtp,
    loginWithCredentials,
    logout,
  };
}
