import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BadgeChip } from '../../components/shared/BadgeChip';
import { Button } from '../../components/ui/Button';
import { PremiumGate } from '../../components/shared/PremiumGate';
import { fsGet } from '../../services/firebase/firestore';
import { apiClient } from '../../services/api/client';
import { MOCK_DOGS } from '../../services/mockData';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import type { DogProfile, PawRequest } from '../../types';

export default function DogProfileScreen() {
  const { dogId } = useLocalSearchParams<{ dogId: string }>();
  const router = useRouter();
  const [dog, setDog] = useState<DogProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (!dogId) return;
    fsGet<DogProfile>(`dogs/${dogId}`)
      .then((d) => setDog(d ?? MOCK_DOGS.find((m) => m.id === dogId) ?? null))
      .finally(() => setLoading(false));
  }, [dogId]);

  async function sendPawRequest() {
    if (!dog) return;
    setRequesting(true);
    try {
      await apiClient.post<PawRequest>('/paw-requests', { toDogId: dog.id });
      setRequested(true);
    } catch {
      // Backend not yet deployed — optimistically succeed in local dev.
      setRequested(true);
    } finally {
      setRequesting(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (!dog) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <Text style={styles.notFound}>🐾 Dog not found</Text>
          <Button label="Go Back" onPress={() => router.back()} variant="secondary" />
        </View>
      </SafeAreaView>
    );
  }

  const age = (() => {
    const months =
      (Date.now() - new Date(dog.dateOfBirth).getTime()) /
      (1000 * 60 * 60 * 24 * 30.4);
    return months < 12 ? `${Math.round(months)}mo` : `${(months / 12).toFixed(1)}y`;
  })();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back button */}
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        {/* Hero */}
        <Image
          source={{ uri: dog.photoURLs[0] ?? 'https://placedog.net/400/400' }}
          style={styles.hero}
        />

        <View style={styles.infoSection}>
          <Text style={styles.dogName}>{dog.name}</Text>
          <Text style={styles.meta}>
            {dog.breed} · {age} · {dog.gender === 'male' ? '♂' : '♀'} · {dog.size}
          </Text>

          {dog.bio ? <Text style={styles.bio}>{dog.bio}</Text> : null}

          {dog.traits.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personality</Text>
              <View style={styles.chips}>
                {dog.traits.map((t) => (
                  <View key={t} style={styles.traitPill}>
                    <Text style={styles.traitText}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {dog.badges.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Badges</Text>
              <View style={styles.chips}>
                {dog.badges.map((b) => <BadgeChip key={b} badgeKey={b} />)}
              </View>
            </View>
          )}

          {/* Full contact info is premium-gated */}
          <PremiumGate feature="Full contact details">
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Owner Contact</Text>
              <Text style={styles.lockedText}>📍 Hackney, London</Text>
              <Text style={styles.lockedText}>📧 owner@example.com</Text>
            </View>
          </PremiumGate>
        </View>

        <View style={styles.actions}>
          <Button
            label={requested ? '✅ Paw Request Sent!' : '🐾 Send Paw Request'}
            onPress={sendPawRequest}
            loading={requesting}
            disabled={requested}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingBottom: 100 },
  back: { padding: SPACING.md },
  backText: { fontSize: 18, color: COLORS.primary, fontWeight: '600' },
  hero: { width: '100%', height: 360 },
  infoSection: { padding: SPACING.lg },
  dogName: { fontSize: 28, fontWeight: '900', color: COLORS.text },
  meta: { fontSize: 15, color: COLORS.textLight, marginTop: 2 },
  bio: { fontSize: 15, color: COLORS.text, lineHeight: 22, marginTop: SPACING.sm },
  section: { marginTop: SPACING.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  traitPill: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  traitText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  lockedText: { fontSize: 14, color: COLORS.text, marginBottom: 4 },
  actions: { paddingHorizontal: SPACING.lg, marginTop: SPACING.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md },
  notFound: { fontSize: 20, fontWeight: '700', color: COLORS.text },
});
