import { useState, useCallback } from 'react';
import { outboxRepo } from '@/db/repositories/outbox.repo';
import { syncApi } from '../api';
import { SyncSummary } from '../types';
import { logger } from '@/core/logger';

export function useSyncQueue() {
  const [summary, setSummary] = useState<SyncSummary>({
    pendingCount: 0,
    failedCount: 0,
    isSyncing: false,
  });

  const triggerSync = useCallback(async () => {
    setSummary((prev) => ({ ...prev, isSyncing: true }));
    try {
      const items = await outboxRepo.getPendingQueue();
      if (items.length === 0) {
        setSummary((prev) => ({ ...prev, isSyncing: false }));
        return;
      }

      const dtoList = items.map((i) => ({
        idempotencyKey: i.idempotency_key,
        action: i.action,
        entityId: i.id,
        payload: JSON.parse(i.payload) as Record<string, unknown>,
        createdAt: i.created_at,
      }));

      const result = await syncApi.processBatch(dtoList);

      // Mark processed items as synced
      for (const key of result.processedKeys) {
        const item = items.find((i) => i.idempotency_key === key);
        if (item) {
          await outboxRepo.markStatus(item.id, 'synced');
        }
      }

      // Mark failed items
      for (const fail of result.failedKeys) {
        const item = items.find((i) => i.idempotency_key === fail.idempotencyKey);
        if (item) {
          await outboxRepo.markStatus(item.id, 'failed', fail.error);
        }
      }
    } catch (error) {
      logger.warn('Sync loop execution paused/failed', { error });
    } finally {
      setSummary((prev) => ({ ...prev, isSyncing: false, lastSyncedAt: new Date().toISOString() }));
    }
  }, []);

  return {
    summary,
    triggerSync,
  };
}
