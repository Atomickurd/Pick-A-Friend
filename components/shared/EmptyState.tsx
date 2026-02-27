import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Button } from '../ui/Button';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

interface EmptyStateProps {
  emoji?: string;
  headline: string;
  subtext?: string;
  ctaLabel?: string;
  onCta?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  emoji = '🐾',
  headline,
  subtext,
  ctaLabel,
  onCta,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.headline}>{headline}</Text>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
      {ctaLabel && onCta ? (
        <Button
          label={ctaLabel}
          onPress={onCta}
          style={styles.cta}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  emoji: { fontSize: 64 },
  headline: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  cta: { marginTop: SPACING.sm },
});
