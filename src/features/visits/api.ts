import { visitsEndpoints } from '@/api/endpoints/visits';

export const visitsApi = {
  getTodayVisits: visitsEndpoints.getTodayVisits,
  getVisitById: visitsEndpoints.getVisitById,
  getAllVisits: visitsEndpoints.getAllVisits,
};
