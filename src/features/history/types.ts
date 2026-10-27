export type { LocalVisit } from '@/db/repositories/visits.repo';

export interface HistoryFilter {
  startDate?: string;
  endDate?: string;
  hospitalId?: string;
}
