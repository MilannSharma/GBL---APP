import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const env = process.env.EXPO_PUBLIC_ENV ?? 'development';
  const suffix = env === 'production' ? '' : `.${env}`;

  return {
    ...config,
    name: env === 'production' ? 'Field Agent' : `Field Agent (${env})`,
    slug: 'field-agent-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'fieldagent',
    userInterfaceStyle: 'light',
    ios: {
      supportsTablet: false,
      bundleIdentifier: `com.gblh.fieldagent${suffix}`,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'Field Agent requires location access to verify arrival at hospital visit appointments.',
        NSCameraUsageDescription:
          'Field Agent requires camera access to document hospital visits, department signboards, and marketing collaterals.',
        NSPhotoLibraryUsageDescription:
          'Field Agent requires photo access to attach visit verification images.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      package: `com.gblh.fieldagent${suffix}`,
      // Never hard-coded: local builds read it from the git-ignored .env, EAS builds from the
      // GOOGLE_MAPS_ANDROID_KEY secret. Not prefixed EXPO_PUBLIC_, so it is not bundled into the JS.
      config: {
        googleMaps: { apiKey: process.env.GOOGLE_MAPS_ANDROID_KEY },
      },
      permissions: [
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
        'CAMERA',
      ],
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'Field Agent requires location access to verify arrival at hospital visit appointments.',
        },
      ],
      [
        'expo-camera',
        {
          cameraPermission:
            'Field Agent requires camera access to document hospital visits.',
        },
      ],
      'expo-sqlite',
      'expo-font',
    ],
  };
};
