export interface SyncSummary {
  pendingCount: number;
  failedCount: number;
  lastSyncedAt?: string;
  isSyncing: boolean;
}
