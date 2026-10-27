import { profileEndpoints } from '@/api/endpoints/profile';

export const profileApi = {
  getProfile: profileEndpoints.getProfile,
  updateProfile: profileEndpoints.updateProfile,
};
