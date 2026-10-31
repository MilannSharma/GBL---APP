import { authEndpoints, AgentLoginRequest, AgentLoginResponse } from '@/api/endpoints/auth';

export const authApi = {
  loginAgent: authEndpoints.loginAgent,
};

export type { AgentLoginRequest, AgentLoginResponse };
