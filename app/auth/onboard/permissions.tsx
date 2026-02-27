import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Button } from '../../../components/ui/Button';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { useUserStore } from '../../../store/user';
import { registerForPushNotifications } from '../../../services/firebase/messaging';

interface Permission {
  emoji: string;
  title: string;
  description: string;
  required: boolean;
}

const PERMISSIONS: Permission[] = [
  {
    emoji: '📍',
    title: 'Location',
    description: 'Shows your dog on the live map and finds nearby friends.',
    required: true,
  },
  {
    emoji: '🔔',
    title: 'Notifications',
    description: 'Get notified about Paw Requests, messages, and lost dog alerts.',
    required: false,
  },
];

export default function PermissionsScreen() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const [loading, setLoading] = useState(false);

  async function handleAllow() {
    setLoading(true);
    try {
      await Location.requestForegroundPermissionsAsync();
      if (user) await registerForPushNotifications(user.uid);
    } catch {
      // permissions are best-effort
    } finally {
      setLoading(false);
      router.replace('/(tabs)/map');
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.stepIndicator}>Step 5 of 5</Text>
      <Text style={styles.title}>Almost there! 🎉</Text>
      <Text style={styles.subtitle}>
        PickAFriend needs a couple of permissions to work its magic.
      </Text>

      <View style={styles.permList}>
        {PERMISSIONS.map((p) => (
          <View key={p.title} style={styles.permRow}>
            <Text style={styles.permEmoji}>{p.emoji}</Text>
            <View style={styles.permText}>
              <Text style={styles.permTitle}>
                {p.title}
                {p.required && <Text style={styles.required}> *</Text>}
              </Text>
              <Text style={styles.permDesc}>{p.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <Button
        label="Allow & Get Started 🐾"
        onPress={handleAllow}
        loading={loading}
        fullWidth
        style={styles.cta}
      />
      <Button
        label="Skip for now"
        onPress={() => router.replace('/(tabs)/map')}
        variant="ghost"
        fullWidth
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flexGrow: 1,
    padding: SPACING.lg,
    gap: SPACING.lg,
    justifyContent: 'center',
    paddingBottom: SPACING.xxl,
  },
  stepIndicator: { fontSize: 13, color: COLORS.textLight, alignSelf: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  subtitle: { fontSize: 15, color: COLORS.textLight, textAlign: 'center', lineHeight: 22 },
  permList: { gap: SPACING.lg },
  permRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md },
  permEmoji: { fontSize: 36, marginTop: 2 },
  permText: { flex: 1 },
  permTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  required: { color: COLORS.error },
  permDesc: { fontSize: 14, color: COLORS.textLight, lineHeight: 20, marginTop: 2 },
  cta: {},
});
