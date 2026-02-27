import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'PickAFriend',
  slug: 'pickafriend',
  version: '1.0.0',
  scheme: 'pickafriend',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#6B21A8',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.pickafriend.app',
    buildNumber: '1',
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'PickAFriend needs your location to show nearby dogs on the map.',
      NSLocationAlwaysAndWhenInUseUsageDescription:
        'PickAFriend uses your location in the background to alert you when a flagged dog is nearby.',
      NSCameraUsageDescription: 'Used to take photos for your dog profile and posts.',
      NSPhotoLibraryUsageDescription: 'Used to upload photos for your dog profile and posts.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#6B21A8',
    },
    package: 'com.pickafriend.app',
    versionCode: 1,
    permissions: [
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'ACCESS_BACKGROUND_LOCATION',
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'RECEIVE_BOOT_COMPLETED',
      'VIBRATE',
    ],
    googleServicesFile: './google-services.json',
  },
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission:
          'PickAFriend uses your location to show nearby dogs and alert you to nearby events.',
        locationAlwaysPermission:
          'PickAFriend uses your background location for Frenemy proximity alerts.',
        locationWhenInUsePermission:
          'PickAFriend uses your location to show nearby dogs on the map.',
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true,
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#6B21A8',
        sounds: [],
      },
    ],
    [
      '@sentry/react-native/expo',
      {
        url: 'https://sentry.io/',
        project: 'pickafriend',
        organization: 'pickafriend',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'PickAFriend accesses your photos to let you upload dog photos.',
        cameraPermission: 'PickAFriend uses your camera to take dog photos.',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: 'your-eas-project-id',
    },
  },
});
