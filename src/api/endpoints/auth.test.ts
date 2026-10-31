import { apiClient } from '../client';
import { authEndpoints } from './auth';

jest.mock('../client', () => ({ apiClient: { post: jest.fn() } }));

const post = apiClient.post as jest.Mock;

describe('loginAgent', () => {
  it('never lets the password hash out of the API layer', async () => {
    post.mockResolvedValueOnce({
      data: {
        token: 't',
        refreshToken: 'r',
        account: { _id: '1', name: 'Aman', password: 'HASHED-SECRET', assignedStates: ['RAJASTHAN'], isManager: true },
      },
    });
    const result = await authEndpoints.loginAgent({ username: 'u', password: 'p' });
    expect(result.account).toEqual({ _id: '1', name: 'Aman', assignedStates: ['RAJASTHAN'], isManager: true });
    expect(JSON.stringify(result)).not.toContain('HASHED-SECRET');
  });

  it('rejects a response without a token', async () => {
    post.mockResolvedValueOnce({ data: { account: { _id: '1', name: 'Aman' } } });
    await expect(authEndpoints.loginAgent({ username: 'u', password: 'p' })).rejects.toMatchObject({
      code: 'INVALID_RESPONSE',
    });
  });
});
