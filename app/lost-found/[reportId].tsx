import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fsGet } from '../../services/firebase/firestore';
import { shareLostFlyer } from '../../services/flyer';
import { Button } from '../../components/ui/Button';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import type { LostReport } from '../../types';

const STATUS_EMOJI: Record<string, string> = {
  lost: '🚨',
  sighted: '👀',
  found: '✅',
  reunited: '🎉',
};

export default function ReportDetailScreen() {
  const { reportId } = useLocalSearchParams<{ reportId: string }>();
  const router = useRouter();
  const [report, setReport] = useState<LostReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reportId) return;
    fsGet<LostReport>(`lost_reports/${reportId}`)
      .then(setReport)
      .finally(() => setLoading(false));
  }, [reportId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <Text style={styles.notFound}>Report not found</Text>
          <Button label="Back" onPress={() => router.back()} variant="secondary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <View style={styles.statusBanner}>
          <Text style={styles.statusEmoji}>{STATUS_EMOJI[report.status] ?? '🚨'}</Text>
          <Text style={styles.statusText}>{report.status.toUpperCase()}</Text>
        </View>

        {report.dogPhotoURL ? (
          <Image source={{ uri: report.dogPhotoURL }} style={styles.photo} />
        ) : null}

        <View style={styles.info}>
          <Text style={styles.dogName}>{report.dogName}</Text>
          <Text style={styles.breed}>{report.dogBreed}</Text>
          <Text style={styles.description}>{report.dogDescription}</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.detailText}>{report.lastSeenAddress}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🕐</Text>
            <Text style={styles.detailText}>
              {new Date(report.lastSeenAt).toLocaleString()}
            </Text>
          </View>

          {report.rewardOffered && report.rewardAmount && (
            <View style={styles.reward}>
              <Text style={styles.rewardText}>💰 Reward: £{report.rewardAmount}</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            label="📞 Call Owner"
            onPress={() => Linking.openURL(`tel:${report.contactPhone}`)}
            fullWidth
          />
          <Button
            label="👀 I've Seen This Dog"
            onPress={() => {}}
            variant="secondary"
            fullWidth
          />
          <Button
            label="🖨️ Share Flyer"
            onPress={() => shareLostFlyer(report)}
            variant="ghost"
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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: '#fee2e2',
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  statusEmoji: { fontSize: 24 },
  statusText: { fontSize: 18, fontWeight: '900', color: '#b91c1c' },
  photo: { width: '100%', height: 280 },
  info: { padding: SPACING.lg, gap: SPACING.sm },
  dogName: { fontSize: 28, fontWeight: '900', color: COLORS.text },
  breed: { fontSize: 15, color: COLORS.textLight },
  description: { fontSize: 15, color: COLORS.text, lineHeight: 22 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  detailIcon: { fontSize: 18, marginTop: 1 },
  detailText: { fontSize: 14, color: COLORS.text, flex: 1 },
  reward: {
    backgroundColor: '#fef9c3',
    borderRadius: 12,
    padding: SPACING.sm,
    alignSelf: 'flex-start',
  },
  rewardText: { fontSize: 16, fontWeight: '700', color: '#ca8a04' },
  actions: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md },
  notFound: { fontSize: 20, fontWeight: '700', color: COLORS.text },
});
