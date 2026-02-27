import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { firebaseAuth } from '../../services/firebase/auth';
import { useUserStore } from '../../store/user';
import { useDogStore } from '../../store/dog';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

interface SettingRow {
  emoji: string;
  label: string;
  route?: string;
  action?: () => void;
  danger?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const clear = useUserStore((s) => s.clear);
  const clearDogs = useDogStore((s) => s.clear);

  async function handleLogout() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await firebaseAuth.logout();
          clear();
          clearDogs();
          router.replace('/auth/login');
        },
      },
    ]);
  }

  const sections: { title: string; rows: SettingRow[] }[] = [
    {
      title: 'Account',
      rows: [
        { emoji: '👑', label: 'Premium Subscription', route: '/settings/subscription' },
        { emoji: '🔒', label: 'Privacy', route: '/settings/privacy' },
        { emoji: '🔔', label: 'Notifications', route: '/settings/notifications' },
      ],
    },
    {
      title: 'App',
      rows: [
        { emoji: '❓', label: 'Help & Support', action: () => {} },
        { emoji: '⭐', label: 'Rate PickAFriend', action: () => {} },
        { emoji: '📋', label: 'Terms of Service', action: () => {} },
        { emoji: '🛡️', label: 'Privacy Policy', action: () => {} },
      ],
    },
    {
      title: 'Account',
      rows: [
        { emoji: '🚪', label: 'Log Out', action: handleLogout, danger: true },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {sections.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.card}>
              {section.rows.map((row, ri) => (
                <TouchableOpacity
                  key={row.label}
                  style={[styles.row, ri < section.rows.length - 1 && styles.rowBorder]}
                  onPress={() => row.action ? row.action() : row.route && router.push(row.route as never)}
                >
                  <Text style={styles.rowEmoji}>{row.emoji}</Text>
                  <Text style={[styles.rowLabel, row.danger && styles.rowLabelDanger]}>
                    {row.label}
                  </Text>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  back: { fontSize: 28, color: COLORS.primary, fontWeight: '600' },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  container: { padding: SPACING.lg, gap: SPACING.lg, paddingBottom: 100 },
  section: { gap: SPACING.xs },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: COLORS.textLight, textTransform: 'uppercase', paddingLeft: SPACING.sm },
  card: { backgroundColor: COLORS.surface, borderRadius: 14, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowEmoji: { fontSize: 20, width: 28 },
  rowLabel: { flex: 1, fontSize: 16, color: COLORS.text },
  rowLabelDanger: { color: COLORS.error },
  chevron: { fontSize: 20, color: COLORS.textLight },
});
