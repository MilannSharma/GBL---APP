import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import Constants, { ExecutionEnvironment } from 'expo-constants';

export const permissions = {
  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === Location.PermissionStatus.GRANTED;
    } catch {
      return false;
    }
  },

  async requestCameraPermission(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === ImagePicker.PermissionStatus.GRANTED;
    } catch {
      return false;
    }
  },

  async requestNotificationPermission(): Promise<boolean> {
    try {
      // Push notifications native modules are not bundled in Expo Go Android client since SDK 53
      if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
        return true;
      }
      const Notifications = await import('expo-notifications');
      const { status } = await Notifications.requestPermissionsAsync();
      return status === Notifications.PermissionStatus.GRANTED;
    } catch {
      return false;
    }
  },
};

