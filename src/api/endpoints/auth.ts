import { apiClient } from '../client';
import { ApiAuthResponse } from '../types';

export const authEndpoints = {
  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>('/auth/otp/send', {
      phone,
    });
    return response.data;
  },

  async verifyOtp(phone: string, otp: string): Promise<ApiAuthResponse> {
    const response = await apiClient.post<ApiAuthResponse>('/auth/otp/verify', {
      phone,
      otp,
    });
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await apiClient.post<{ token: string }>('/auth/token/refresh', {
      refreshToken,
    });
    return response.data;
  },
};
