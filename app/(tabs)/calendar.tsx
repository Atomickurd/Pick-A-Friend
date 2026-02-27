import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '../../components/shared/EmptyState';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import type { CalendarEntry } from '../../types';

const CATEGORY_EMOJI: Record<string, string> = {
  playdate: '🐕',
  training: '🏋️',
  agility: '🏃',
  birthday: '🎂',
  meetup: '🤝',
  charity: '🎗️',
  vet: '🏥',
  grooming: '✂️',
  medication: '💊',
  personal: '📌',
  other: '📅',
};

function CalendarEntryCard({ entry }: { entry: CalendarEntry }) {
  const start = new Date(entry.startAt);
  return (
    <View style={styles.entryCard}>
      <View style={styles.dateBlock}>
        <Text style={styles.dateMonth}>
          {start.toLocaleString('default', { month: 'short' })}
        </Text>
        <Text style={styles.dateDay}>{start.getDate()}</Text>
      </View>
      <View style={styles.entryBody}>
        <Text style={styles.entryEmoji}>{CATEGORY_EMOJI[entry.category] ?? '📅'}</Text>
        <View style={styles.entryText}>
          <Text style={styles.entryTitle}>{entry.title}</Text>
          <Text style={styles.entryTime}>
            {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {entry.notes ? (
            <Text style={styles.entryNotes} numberOfLines={2}>{entry.notes}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default function CalendarScreen() {
  const router = useRouter();
  const [entries] = useState<CalendarEntry[]>([]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Dog Calendar 📅</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {/* TODO: add event modal */}}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Month strip */}
      <View style={styles.monthStrip}>
        {Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() + i);
          const isToday = i === 0;
          return (
            <TouchableOpacity key={i} style={[styles.dayPill, isToday && styles.dayPillActive]}>
              <Text style={[styles.dayName, isToday && styles.dayNameActive]}>
                {d.toLocaleString('default', { weekday: 'short' }).slice(0, 1)}
              </Text>
              <Text style={[styles.dayNum, isToday && styles.dayNumActive]}>
                {d.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={entries}
        keyExtractor={(e) => e.id}
        renderItem={({ item }) => <CalendarEntryCard entry={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            emoji="📅"
            headline="No events scheduled"
            subtext="Add playdates, vet visits, training sessions and more."
            ctaLabel="Add First Event"
            onCta={() => {}}
          />
        }
      />
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
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  monthStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  dayPill: {
    alignItems: 'center',
    width: 40,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  dayPillActive: { backgroundColor: COLORS.primary },
  dayName: { fontSize: 12, color: COLORS.textLight },
  dayNameActive: { color: '#fff' },
  dayNum: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  dayNumActive: { color: '#fff' },
  list: { paddingHorizontal: SPACING.md, paddingBottom: 100 },
  entryCard: {
    flexDirection: 'row',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  dateBlock: { alignItems: 'center', width: 40 },
  dateMonth: { fontSize: 11, color: COLORS.textLight, textTransform: 'uppercase' },
  dateDay: { fontSize: 24, fontWeight: '800', color: COLORS.primary },
  entryBody: { flex: 1, flexDirection: 'row', gap: SPACING.sm },
  entryEmoji: { fontSize: 24, marginTop: 2 },
  entryText: { flex: 1 },
  entryTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  entryTime: { fontSize: 13, color: COLORS.textLight },
  entryNotes: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
});
