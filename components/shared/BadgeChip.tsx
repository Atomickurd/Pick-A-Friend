import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { BADGES } from '../../constants/badges';

interface BadgeChipProps {
  badgeKey: string;
  style?: ViewStyle;
}

export function BadgeChip({ badgeKey, style }: BadgeChipProps) {
  const badge = BADGES.find((b) => b.id === badgeKey);
  if (!badge) return null;

  return (
    <View style={[styles.chip, style]}>
      <Text style={styles.icon}>{badge.emoji}</Text>
      <Text style={styles.label}>{badge.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    gap: 4,
    alignSelf: 'flex-start',
  },
  icon: { fontSize: 14 },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
});
