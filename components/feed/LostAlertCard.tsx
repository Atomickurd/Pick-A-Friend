import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import type { LostReport } from '../../types';

interface LostAlertCardProps {
  report: LostReport;
}

export function LostAlertCard({ report }: LostAlertCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/lost-found/${report.id}` as never)}
      activeOpacity={0.88}
    >
      <View style={styles.alertBanner}>
        <Text style={styles.alertText}>🚨 LOST DOG ALERT</Text>
      </View>
      <View style={styles.body}>
        <Image source={{ uri: report.dogPhotoURL }} style={styles.photo} />
        <View style={styles.info}>
          <Text style={styles.dogName}>{report.dogName}</Text>
          <Text style={styles.breed}>{report.dogBreed}</Text>
          <Text style={styles.location} numberOfLines={2}>
            📍 Last seen: {report.lastSeenAddress}
          </Text>
          <Text style={styles.time}>
            {new Date(report.lastSeenAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.seenBtn}>
          <Text style={styles.seenBtnText}>👀 Seen Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactBtn}>
          <Text style={styles.contactBtnText}>📞 Contact Owner</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ef4444',
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  alertBanner: { backgroundColor: '#ef4444', padding: SPACING.xs, alignItems: 'center' },
  alertText: { color: '#fff', fontWeight: '800', fontSize: 13, letterSpacing: 1 },
  body: { flexDirection: 'row', gap: SPACING.md, padding: SPACING.md },
  photo: { width: 80, height: 80, borderRadius: 12 },
  info: { flex: 1, gap: 2 },
  dogName: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  breed: { fontSize: 13, color: COLORS.textLight },
  location: { fontSize: 13, color: COLORS.text },
  time: { fontSize: 12, color: COLORS.textLight },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  seenBtn: {
    flex: 1,
    padding: SPACING.sm,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  seenBtnText: { fontSize: 14, fontWeight: '600', color: '#ef4444' },
  contactBtn: { flex: 1, padding: SPACING.sm, alignItems: 'center' },
  contactBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
});
