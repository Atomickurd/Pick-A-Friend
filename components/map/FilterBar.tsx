import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { FilterChip } from '../shared/FilterChip';
import { useMapStore } from '../../store/map';
import { SPACING } from '../../constants/spacing';

const GENDER_OPTIONS = ['male', 'female'];
const SIZE_OPTIONS = ['tiny', 'small', 'medium', 'large', 'giant'];
const ENERGY_OPTIONS = ['low', 'medium', 'high'];
const NATURE_OPTIONS = ['loves', 'okay', 'prefers_not'];

const GENDER_LABELS: Record<string, string> = { male: '♂ Boys', female: '♀ Girls' };
const SIZE_LABELS: Record<string, string> = {
  tiny: 'Tiny', small: 'Small', medium: 'Medium', large: 'Large', giant: 'Giant',
};
const ENERGY_LABELS: Record<string, string> = { low: 'Low-key', medium: 'Moderate', high: 'Energetic' };
const NATURE_LABELS: Record<string, string> = { loves: 'Friendly', okay: 'Okay', prefers_not: 'Prefers calm' };

export function FilterBar() {
  const { filter, setFilter } = useMapStore();

  function toggleArray(field: 'gender' | 'size' | 'energy' | 'nature', value: string) {
    const current = filter[field] as string[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilter({ [field]: next });
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {GENDER_OPTIONS.map((v) => (
        <FilterChip
          key={`gender-${v}`}
          label={GENDER_LABELS[v]}
          active={filter.gender.includes(v)}
          onPress={() => toggleArray('gender', v)}
        />
      ))}
      <View style={styles.divider} />
      {SIZE_OPTIONS.map((v) => (
        <FilterChip
          key={`size-${v}`}
          label={SIZE_LABELS[v]}
          active={filter.size.includes(v)}
          onPress={() => toggleArray('size', v)}
        />
      ))}
      <View style={styles.divider} />
      {ENERGY_OPTIONS.map((v) => (
        <FilterChip
          key={`energy-${v}`}
          label={ENERGY_LABELS[v]}
          active={filter.energy.includes(v)}
          onPress={() => toggleArray('energy', v)}
        />
      ))}
      <View style={styles.divider} />
      {NATURE_OPTIONS.map((v) => (
        <FilterChip
          key={`nature-${v}`}
          label={NATURE_LABELS[v]}
          active={filter.nature.includes(v)}
          onPress={() => toggleArray('nature', v)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { maxHeight: 48 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  divider: { width: 1, height: 24, backgroundColor: '#e5e7eb', marginHorizontal: 2 },
});
