import { useRef } from 'react';
import { Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore, selectIsPremium } from '../store/user';

export function usePremium() {
  const isPremium = useUserStore(selectIsPremium);
  const router = useRouter();
  const shakeAnim = useRef(new Animated.Value(0)).current;

  function shake() {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }

  /**
   * Call this before any premium-gated action.
   * If the user is free tier, shakes and redirects to premium screen,
   * then returns false. If premium, returns true.
   */
  function gate(): boolean {
    if (isPremium) return true;
    shake();
    router.push('/premium');
    return false;
  }

  return { isPremium, gate, shakeAnim };
}
