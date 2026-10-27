import { apiClient } from '../client';
import { ApiHospitalDto } from '../types';

export const hospitalsEndpoints = {
  async getHospitals(): Promise<ApiHospitalDto[]> {
    const response = await apiClient.get<ApiHospitalDto[]>('/hospitals');
    return response.data;
  },

  async getHospitalById(id: string): Promise<ApiHospitalDto> {
    const response = await apiClient.get<ApiHospitalDto>(`/hospitals/${id}`);
    return response.data;
  },
};
