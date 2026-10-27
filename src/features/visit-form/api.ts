import { apiClient } from '@/api/client';
import { VisitFormData } from './types';

export const visitFormApi = {
  async submitForm(data: VisitFormData): Promise<void> {
    await apiClient.post(`/visits/${data.visitId}/form`, data);
  },
};
