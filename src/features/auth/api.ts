import { authEndpoints } from '@/api/endpoints/auth';

export const authApi = {
  sendOtp: authEndpoints.sendOtp,
  verifyOtp: authEndpoints.verifyOtp,
  refreshToken: authEndpoints.refreshToken,
};
