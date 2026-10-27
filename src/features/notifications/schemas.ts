import { z } from 'zod';

export const notificationActionSchema = z.object({
  id: z.string(),
  action: z.enum(['mark_read', 'delete']),
});
