import { hospitalsEndpoints } from '@/api/endpoints/hospitals';

export const hospitalsApi = {
  getHospitals: hospitalsEndpoints.getHospitals,
  getHospitalById: hospitalsEndpoints.getHospitalById,
};
