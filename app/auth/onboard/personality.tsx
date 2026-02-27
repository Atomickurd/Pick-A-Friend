import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../../components/ui/Button';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TRAITS } from '../../../constants/traits';
import { useDogStore, selectActiveDog } from '../../../store/dog';
import { fsUpdate } from '../../../services/firebase/firestore';

const MAX_TRAITS = 10;

export default function PersonalityScreen() {
  const router = useRouter();
  const activeDog = useDogStore(selectActiveDog);
  const updateDog = useDogStore((s) => s.updateDog);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function toggle(trait: string) {
    setSelected((prev) => {
      if (prev.includes(trait)) return prev.filter((t) => t !== trait);
      if (prev.length >= MAX_TRAITS) return prev;
      return [...prev, trait];
    });
  }

  async function handleNext() {
    if (!activeDog) return;
    setLoading(true);
    try {
      await fsUpdate(`dogs/${activeDog.id}`, { traits: selected });
      updateDog(activeDog.id, { traits: selected });
      router.push('/auth/onboard/social-prefs');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.stepIndicator}>Step 2 of 5</Text>
      <Text style={styles.title}>{"What's their personality? 🎭"}</Text>
      <Text style={styles.subtitle}>
        Pick up to {MAX_TRAITS} traits ({selected.length}/{MAX_TRAITS})
      </Text>

      <View style={styles.grid}>
        {TRAITS.map((trait) => {
          const isSelected = selected.includes(trait.id);
          return (
            <TouchableOpacity
              key={trait.id}
              onPress={() => toggle(trait.id)}
              style={[styles.traitChip, isSelected && styles.traitChipActive]}
            >
              <Text style={styles.traitEmoji}>{trait.emoji}</Text>
              <Text style={[styles.traitLabel, isSelected && styles.traitLabelActive]}>
                {trait.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Button
        label="Next →"
        onPress={handleNext}
        loading={loading}
        fullWidth
        style={styles.nextBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  stepIndicator: { fontSize: 13, color: COLORS.textLight, alignSelf: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: COLORS.textLight, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  traitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  traitChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  traitEmoji: { fontSize: 16 },
  traitLabel: { fontSize: 14, color: COLORS.textLight },
  traitLabelActive: { color: '#fff', fontWeight: '600' },
  nextBtn: { marginTop: SPACING.md },
});
