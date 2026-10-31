import { z } from 'zod';
import { apiClient } from '../client';
import { AppError } from '../errors';

export interface AgentLoginRequest {
  username?: string;
  contact?: number;
  password?: string;
}

// Zod drops every field not listed here, so the password hash that the login payload carries
// never leaves this file.
const AgentAccountSchema = z.object({
  _id: z.string(),
  name: z.string(),
  code: z.string().nullish(),
  username: z.string().nullish(),
  contact: z.union([z.number(), z.string()]).nullish(),
  email: z.string().nullish(),
  isManager: z.boolean().nullish(),
  isActive: z.boolean().nullish(),
  assignedStates: z.array(z.string()).nullish(),
});

const AgentLoginResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string().nullish(),
  account: AgentAccountSchema,
});

export type AgentLoginResponse = z.infer<typeof AgentLoginResponseSchema>;

export const authEndpoints = {
  async loginAgent(credentials: AgentLoginRequest): Promise<AgentLoginResponse> {
    const response = await apiClient.post<unknown>('/api/v1/auth/login/agent', credentials);
    const parsed = AgentLoginResponseSchema.safeParse(response.data);
    if (!parsed.success) throw new AppError('INVALID_RESPONSE', 'Unexpected login response');
    return parsed.data;
  },
};
