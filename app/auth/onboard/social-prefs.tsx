import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../../components/ui/Button';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { useDogStore, selectActiveDog } from '../../../store/dog';
import { fsUpdate } from '../../../services/firebase/firestore';
import type { SocialPreference, EnergyLevel } from '../../../types';

type Option<T extends string> = { label: string; value: T; emoji: string };

const SOCIAL_PREFS: Option<SocialPreference>[] = [
  { label: 'Loves it!', value: 'loves', emoji: '🥰' },
  { label: 'It\'s okay', value: 'okay', emoji: '😐' },
  { label: 'Prefers not', value: 'prefers_not', emoji: '😬' },
];

const ENERGY_PREFS: Option<EnergyLevel>[] = [
  { label: 'Low-key', value: 'low', emoji: '🛋️' },
  { label: 'Moderate', value: 'medium', emoji: '🚶' },
  { label: 'High energy', value: 'high', emoji: '⚡' },
];

function PrefRow<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: Option<T>[];
  selected: T | null;
  onSelect: (v: T) => void;
}) {
  return (
    <View style={styles.prefSection}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.pills}>
        {options.map((o) => (
          <TouchableOpacity
            key={o.value}
            style={[styles.pill, selected === o.value && styles.pillActive]}
            onPress={() => onSelect(o.value)}
          >
            <Text style={styles.pillEmoji}>{o.emoji}</Text>
            <Text
              style={[
                styles.pillLabel,
                selected === o.value && styles.pillLabelActive,
              ]}
            >
              {o.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function SocialPrefsScreen() {
  const router = useRouter();
  const activeDog = useDogStore(selectActiveDog);
  const updateDog = useDogStore((s) => s.updateDog);
  const [dogSocial, setDogSocial] = useState<SocialPreference | null>(null);
  const [humanSocial, setHumanSocial] = useState<SocialPreference | null>(null);
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleNext() {
    if (!dogSocial || !humanSocial || !energy) {
      setError('Please select all preferences.');
      return;
    }
    if (!activeDog) return;
    setLoading(true);
    setError('');
    try {
      const updates = { dogSocialPref: dogSocial, humanSocialPref: humanSocial, energyLevel: energy };
      await fsUpdate(`dogs/${activeDog.id}`, updates);
      updateDog(activeDog.id, updates);
      router.push('/auth/onboard/owner');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.stepIndicator}>Step 3 of 5</Text>
      <Text style={styles.title}>How does your pup feel? 🤔</Text>

      <PrefRow
        label="Around other dogs?"
        options={SOCIAL_PREFS}
        selected={dogSocial}
        onSelect={setDogSocial}
      />
      <PrefRow
        label="Around new people?"
        options={SOCIAL_PREFS}
        selected={humanSocial}
        onSelect={setHumanSocial}
      />
      <PrefRow
        label="Energy level?"
        options={ENERGY_PREFS}
        selected={energy}
        onSelect={setEnergy}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button label="Next →" onPress={handleNext} loading={loading} fullWidth style={styles.nextBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xxl },
  stepIndicator: { fontSize: 13, color: COLORS.textLight, alignSelf: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  prefSection: { gap: SPACING.sm },
  sectionLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  pills: { flexDirection: 'row', gap: SPACING.sm },
  pill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    gap: 4,
  },
  pillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  pillEmoji: { fontSize: 22 },
  pillLabel: { fontSize: 12, color: COLORS.textLight, textAlign: 'center' },
  pillLabelActive: { color: '#fff', fontWeight: '600' },
  error: { color: COLORS.error, fontSize: 13 },
  nextBtn: {},
});
