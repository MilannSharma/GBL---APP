import { getDb } from '../client';

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
};
