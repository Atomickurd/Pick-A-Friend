import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LostAlertCard } from '../../components/feed/LostAlertCard';
import { AdoptionCarousel } from '../../components/feed/AdoptionCarousel';
import { EmptyState } from '../../components/shared/EmptyState';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import type { LostReport, AdoptionDog } from '../../types';

type Tab = 'lost_found' | 'adoption';

export default function SocialScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('lost_found');

  // Placeholder data — replaced by real API calls in prod
  const lostReports: LostReport[] = [];
  const adoptionDogs: AdoptionDog[] = [];

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Community 🏠</Text>
        {activeTab === 'lost_found' && (
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() => router.push('/lost-found/report' as never)}
          >
            <Text style={styles.reportBtnText}>+ Report Lost Dog</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {(['lost_found', 'adoption'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'lost_found' ? '🚨 Lost & Found' : '🐶 Adopt'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'lost_found' ? (
        <FlatList
          data={lostReports}
          keyExtractor={(r) => r.id}
          renderItem={({ item }) => <LostAlertCard report={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              emoji="🙏"
              headline="No active lost dog reports"
              subtext="Good news! All pups in your area are safe and accounted for."
              ctaLabel="Report a Lost Dog"
              onCta={() => router.push('/lost-found/report' as never)}
            />
          }
        />
      ) : (
        <FlatList
          data={[]}
          keyExtractor={() => 'adopt'}
          renderItem={() => null}
          ListHeaderComponent={<AdoptionCarousel dogs={adoptionDogs} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              emoji="🐶"
              headline="No adoption listings yet"
              subtext="Partner shelters will appear here soon."
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  reportBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  reportBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textLight },
  tabTextActive: { color: '#fff' },
  list: { paddingHorizontal: SPACING.md, paddingBottom: 100 },
});
