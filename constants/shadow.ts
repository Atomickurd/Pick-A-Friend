import { Platform } from 'react-native';

/**
 * Returns cross-platform shadow styles.
 * – Web: CSS `boxShadow` (avoids React Native Web deprecation warnings).
 * – iOS: native shadow props.
 * – Android: `elevation`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeShadow(offsetY: number, radius: number, opacity: number, elevation = Math.round(radius / 2)): any {
  if (Platform.OS === 'web') {
    return { boxShadow: `0 ${offsetY}px ${radius}px rgba(0,0,0,${opacity})` };
  }
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  };
}
