import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { usePremium } from '../../hooks/usePremium';

interface PremiumGateProps {
  feature: string;
  children: React.ReactNode;
}

/**
 * Wraps any gated content.
 * Free-tier users see a blurred lock overlay with an upsell CTA.
 */
export function PremiumGate({ feature, children }: PremiumGateProps) {
  const { isPremium, shakeAnim } = usePremium();
  const router = useRouter();

  if (isPremium) return <>{children}</>;

  return (
    <View style={styles.wrapper}>
      <View style={styles.blurred} pointerEvents="none">
        {children}
      </View>
      <Animated.View
        style={[styles.overlay, { transform: [{ translateX: shakeAnim }] }]}
      >
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.featureText}>{feature}</Text>
        <Text style={styles.subtitle}>Upgrade to Premium to unlock</Text>
        <TouchableOpacity
          style={styles.cta}
          onPress={() => router.push('/premium')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Unlock Now</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  blurred: { opacity: 0.25 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    padding: SPACING.xl,
    gap: SPACING.sm,
  },
  lockIcon: { fontSize: 40 },
  featureText: { fontSize: 18, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: COLORS.textLight, textAlign: 'center' },
  cta: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: 24,
  },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
