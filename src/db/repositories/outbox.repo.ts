import { getDb } from '../client';

export interface OutboxRecord {
  id: string;
  idempotency_key: string;
  action: 'check_in' | 'upload_photo' | 'submit_form' | 'check_out';
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH';
  payload: string;
  depends_on?: string | null;
  attempts: number;
  max_attempts: number;
  next_attempt_at: string;
  last_error?: string | null;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  created_at: string;
  updated_at: string;
}

export const outboxRepo = {
  async enqueue(
    item: Omit<OutboxRecord, 'attempts' | 'max_attempts' | 'status' | 'created_at' | 'updated_at'>
  ): Promise<void> {
    const db = await getDb();
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO outbox (
        id, idempotency_key, action, endpoint, method, payload, depends_on,
        attempts, max_attempts, next_attempt_at, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 5, ?, 'pending', ?, ?)`,
      [
        item.id,
        item.idempotency_key,
        item.action,
        item.endpoint,
        item.method,
        item.payload,
        item.depends_on || null,
        item.next_attempt_at,
        now,
        now,
      ]
    );
  },

  async getPendingQueue(): Promise<OutboxRecord[]> {
    const db = await getDb();
    const now = new Date().toISOString();
    return await db.getAllAsync<OutboxRecord>(
      `SELECT * FROM outbox 
       WHERE status = 'pending' AND next_attempt_at <= ? 
       ORDER BY created_at ASC`,
      [now]
    );
  },

  async markStatus(
    id: string,
    status: OutboxRecord['status'],
    lastError?: string,
    nextAttemptAt?: string
  ): Promise<void> {
    const db = await getDb();
    const now = new Date().toISOString();
    await db.runAsync(
      `UPDATE outbox 
       SET status = ?, last_error = ?, next_attempt_at = COALESCE(?, next_attempt_at), updated_at = ? 
       WHERE id = ?`,
      [status, lastError || null, nextAttemptAt || null, now, id]
    );
  },
};
