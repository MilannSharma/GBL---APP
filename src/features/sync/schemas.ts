import { z } from 'zod';

export const syncItemSchema = z.object({
  id: z.string(),
  action: z.enum(['check_in', 'upload_photo', 'submit_form', 'check_out']),
  status: z.enum(['pending', 'syncing', 'synced', 'failed']),
});
