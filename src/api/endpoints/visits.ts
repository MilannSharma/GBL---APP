import { apiClient } from '../client';
import { ApiVisitDto } from '../types';

export const visitsEndpoints = {
  async getTodayVisits(): Promise<ApiVisitDto[]> {
    const response = await apiClient.get<ApiVisitDto[]>('/visits/today');
    return response.data;
  },

  async getVisitById(id: string): Promise<ApiVisitDto> {
    const response = await apiClient.get<ApiVisitDto>(`/visits/${id}`);
    return response.data;
  },

  async getAllVisits(params?: { status?: string; from?: string; to?: string }): Promise<ApiVisitDto[]> {
    const response = await apiClient.get<ApiVisitDto[]>('/visits', { params });
    return response.data;
  },
};
