import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
  style?: ViewStyle;
}

export function Toast({
  message,
  type = 'info',
  duration = 2500,
  onHide,
  style,
}: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(duration),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onHide?.());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[styles.container, styles[type], { opacity }, style]}
      pointerEvents="none"
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    borderRadius: 24,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    maxWidth: 320,
    zIndex: 9999,
  },
  success: { backgroundColor: COLORS.success },
  error: { backgroundColor: COLORS.error },
  info: { backgroundColor: COLORS.text },
  text: { color: '#fff', fontWeight: '600', fontSize: 14, textAlign: 'center' },
});
