import { getDb } from '../client';
import { outboxRepo } from './outbox.repo';
import { visitsEndpoints } from '@/api/endpoints/visits';
import { logger } from '@/core/logger';

export interface LocalVisit {
  id: string;
  agent_id: string;
  hospital_id: string;
  hospital_name: string;
  scheduled_date: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  check_in_time?: string | null;
  check_out_time?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string | null;
  photo_urls?: string | null;
  signature_url?: string | null;
  sync_status: 'draft' | 'pending' | 'synced' | 'failed';
  last_modified_at: string;
  created_at: string;
}

export const visitsRepo = {
  async getTodayVisits(): Promise<LocalVisit[]> {
    const db = await getDb();
    const today = new Date().toISOString().split('T')[0];
    return await db.getAllAsync<LocalVisit>(
      `SELECT * FROM visits WHERE scheduled_date = ? ORDER BY scheduled_date ASC`,
      [today]
    );
  },

  async getVisitById(id: string): Promise<LocalVisit | null> {
    const db = await getDb();
    return await db.getFirstAsync<LocalVisit>(`SELECT * FROM visits WHERE id = ?`, [id]);
  },

  async refreshTodayVisitsFromApi(): Promise<void> {
    try {
      const remoteVisits = await visitsEndpoints.getTodayVisits();
      const db = await getDb();
      const now = new Date().toISOString();

      await db.withTransactionAsync(async () => {
        for (const v of remoteVisits) {
          await db.runAsync(
            `INSERT OR REPLACE INTO visits (
              id, agent_id, hospital_id, hospital_name, scheduled_date, status,
              check_in_time, check_out_time, latitude, longitude, notes,
              photo_urls, signature_url, sync_status, last_modified_at, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced', ?, ?)`,
            [
              v.id,
              v.agentId,
              v.hospitalId,
              v.hospitalName,
              v.scheduledDate,
              v.status,
              v.checkInTime || null,
              v.checkOutTime || null,
              v.latitude || null,
              v.longitude || null,
              v.notes || null,
              v.photoUrls ? JSON.stringify(v.photoUrls) : null,
              v.signatureUrl || null,
              v.updatedAt || now,
              now,
            ]
          );
        }
      });
    } catch (error) {
      logger.warn('Failed to refresh visits from API, keeping local cache', { error });
    }
  },

  async checkInOptimistic(
    visitId: string,
    idempotencyKey: string,
    latitude: number,
    longitude: number
  ): Promise<void> {
    const db = await getDb();
    const now = new Date().toISOString();

    await db.withTransactionAsync(async () => {
      // 1. Update local visit optimistically
      await db.runAsync(
        `UPDATE visits 
         SET status = 'in_progress', check_in_time = ?, latitude = ?, longitude = ?, sync_status = 'pending', last_modified_at = ?
         WHERE id = ?`,
        [now, latitude, longitude, now, visitId]
      );

      // 2. Queue outbox item in the same transaction
      await outboxRepo.enqueue({
        id: idempotencyKey,
        idempotency_key: idempotencyKey,
        action: 'check_in',
        endpoint: `/visits/${visitId}/check-in`,
        method: 'POST',
        payload: JSON.stringify({ latitude, longitude, checkInTime: now }),
        next_attempt_at: now,
      });
    });
  },
};
