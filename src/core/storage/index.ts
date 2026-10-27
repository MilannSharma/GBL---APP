import * as SecureStore from 'expo-secure-store';

export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      // Handled silently to avoid breaking UX
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Ignored
    }
  },

  // Common Storage Keys
  keys: {
    AUTH_TOKEN: 'gblh_auth_token',
    REFRESH_TOKEN: 'gblh_refresh_token',
    USER_PROFILE: 'gblh_user_profile',
    LAST_SYNC_TIMESTAMP: 'gblh_last_sync_timestamp',
  },
};
