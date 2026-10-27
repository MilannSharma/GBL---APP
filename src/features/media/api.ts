import { uploadsEndpoints } from '@/api/endpoints/uploads';

export const mediaApi = {
  getPresignedUploadUrl: uploadsEndpoints.getPresignedUploadUrl,
  completeUpload: uploadsEndpoints.completeUpload,
};
