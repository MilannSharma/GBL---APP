import { apiClient } from '../client';
import { ApiSyncItemDto } from '../types';

export interface SyncBatchResponse {
  processedKeys: string[];
  failedKeys: { idempotencyKey: string; error: string }[];
}

export const syncEndpoints = {
  async processBatch(items: ApiSyncItemDto[]): Promise<SyncBatchResponse> {
    const response = await apiClient.post<SyncBatchResponse>('/sync/batch', { items });
    return response.data;
  },
};
