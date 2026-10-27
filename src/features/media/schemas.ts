import { z } from 'zod';

export const photoUploadSchema = z.object({
  uri: z.string().min(1, 'Photo URI is required'),
  visitId: z.string().min(1, 'Visit ID is required'),
});
