import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { useUserStore } from '../../../store/user';
import { fsUpdate } from '../../../services/firebase/firestore';

export default function OwnerScreen() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);
  const [city, setCity] = useState('');
  const [neighbourhood, setNeighbourhood] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleNext() {
    if (!city) {
      setError('Please enter your city.');
      return;
    }
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      await fsUpdate(`users/${user.uid}`, { city: city.trim(), neighbourhood: neighbourhood.trim() });
      updateUser({ city: city.trim(), neighbourhood: neighbourhood.trim() });
      router.push('/auth/onboard/permissions');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.screen} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.stepIndicator}>Step 4 of 5</Text>
        <Text style={styles.title}>Where are you based? 📍</Text>
        <Text style={styles.subtitle}>{"We'll use this to find local dogs and events."}</Text>

        <Input label="City *" value={city} onChangeText={setCity} placeholder="London" autoCapitalize="words" />
        <Input label="Neighbourhood" value={neighbourhood} onChangeText={setNeighbourhood} placeholder="Hackney" autoCapitalize="words" hint="Optional — helps find even more local dogs" />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button label="Next →" onPress={handleNext} loading={loading} fullWidth style={styles.nextBtn} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  screen: { flex: 1 },
  container: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  stepIndicator: { fontSize: 13, color: COLORS.textLight, alignSelf: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginBottom: SPACING.sm },
  error: { color: COLORS.error, fontSize: 13 },
  nextBtn: { marginTop: SPACING.md },
});
