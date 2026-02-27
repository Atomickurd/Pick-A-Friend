import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import type { BusinessCategory } from '../../types';

const CATEGORY_EMOJI: Record<BusinessCategory, string> = {
  vet: '🏥',
  groomer: '✂️',
  trainer: '🏋️',
  pet_store: '🛒',
  dog_cafe: '☕',
  dog_park: '🌳',
  boarding: '🏠',
  daycare: '🧸',
  other: '🐾',
};

interface BusinessPinProps {
  category: BusinessCategory;
  name: string;
  onPress: () => void;
}

export function BusinessPin({ category, name, onPress }: BusinessPinProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.wrapper}>
      <View style={styles.circle}>
        <Text style={styles.emoji}>{CATEGORY_EMOJI[category] ?? '🐾'}</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: 2 },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.businessPin,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  emoji: { fontSize: 20 },
  label: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    maxWidth: 80,
  },
  name: { fontSize: 10, fontWeight: '500', color: Colors.dark, textAlign: 'center' },
});
