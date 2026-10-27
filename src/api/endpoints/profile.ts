import { apiClient } from '../client';
import { ApiAuthResponse } from '../types';

export const profileEndpoints = {
  async getProfile(): Promise<ApiAuthResponse['agent']> {
    const response = await apiClient.get<ApiAuthResponse['agent']>('/profile');
    return response.data;
  },

  async updateProfile(data: Partial<ApiAuthResponse['agent']>): Promise<ApiAuthResponse['agent']> {
    const response = await apiClient.put<ApiAuthResponse['agent']>('/profile', data);
    return response.data;
  },
};
