import { apiClient } from '../client';

export const uploadsEndpoints = {
  async getPresignedUploadUrl(fileName: string, mimeType: string): Promise<{ uploadUrl: string; fileKey: string }> {
    const response = await apiClient.post<{ uploadUrl: string; fileKey: string }>('/uploads/presign', {
      fileName,
      mimeType,
    });
    return response.data;
  },

  async completeUpload(fileKey: string, visitId: string, type: 'photo' | 'signature'): Promise<{ url: string }> {
    const response = await apiClient.post<{ url: string }>('/uploads/complete', {
      fileKey,
      visitId,
      type,
    });
    return response.data;
  },
};
