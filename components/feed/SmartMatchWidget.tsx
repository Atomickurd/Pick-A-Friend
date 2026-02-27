import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import type { MatchResult } from '../../services/api/matching';

interface SmartMatchWidgetProps {
  matches: MatchResult[];
  onSeeAll: () => void;
}

export function SmartMatchWidget({ matches, onSeeAll }: SmartMatchWidgetProps) {
  const router = useRouter();
  if (matches.length === 0) return null;

  return (
    <View style={styles.widget}>
      <View style={styles.widgetHeader}>
        <Text style={styles.widgetTitle}>✨ Top Matches Near You</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {matches.slice(0, 5).map(({ dog, match }) => (
          <TouchableOpacity
            key={dog.id}
            style={styles.matchCard}
            onPress={() => router.push(`/profile/${dog.id}` as never)}
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: dog.photoURLs[0] ?? 'https://placedog.net/120' }}
              style={styles.photo}
            />
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{Math.round(match.score)}%</Text>
            </View>
            <Text style={styles.dogName} numberOfLines={1}>{dog.name}</Text>
            <Text style={styles.dogBreed} numberOfLines={1}>{dog.breed}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  widget: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: SPACING.md,
    paddingTop: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  widgetTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  scroll: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, gap: SPACING.sm },
  matchCard: { width: 100, alignItems: 'center', gap: 4 },
  photo: { width: 80, height: 80, borderRadius: 40 },
  scoreBadge: {
    position: 'absolute',
    top: 60,
    right: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  scoreText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  dogName: { fontSize: 13, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  dogBreed: { fontSize: 11, color: COLORS.textLight, textAlign: 'center' },
});
