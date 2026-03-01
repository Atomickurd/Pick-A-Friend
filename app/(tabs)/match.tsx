import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SwipeCard } from '../../components/match/SwipeCard';
import { EmptyState } from '../../components/shared/EmptyState';
import { useMatching } from '../../hooks/useMatching';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { makeShadow } from '../../constants/shadow';

export default function MatchScreen() {
  const router = useRouter();
  const { stack, isLoading, error, loadMatches, swipeRight, swipeLeft } = useMatching();

  useEffect(() => {
    loadMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleWoof() {
    const match = await swipeRight();
    if (match) {
      // TODO: show match celebration modal
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Find a Friend 🤝</Text>
        <TouchableOpacity onPress={() => router.push('/premium' as never)}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardArea}>
        {isLoading && stack.length === 0 ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : error ? (
          <EmptyState
            emoji="😕"
            headline="Couldn't load matches"
            subtext={error}
            ctaLabel="Try Again"
            onCta={loadMatches}
          />
        ) : stack.length === 0 ? (
          <EmptyState
            emoji="🐶"
            headline="No more dogs nearby!"
            subtext="Check back later or expand your radius with Premium."
            ctaLabel="Go Premium"
            onCta={() => router.push('/premium' as never)}
          />
        ) : (
          stack
            .slice(0, 3)
            .reverse()
            .map((result, i, arr) => (
              <SwipeCard
                key={result.dog.id}
                result={result}
                isTop={i === arr.length - 1}
                onSwipeRight={handleWoof}
                onSwipeLeft={swipeLeft}
              />
            ))
        )}
      </View>

      {stack.length > 0 && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.skipBtn]}
            onPress={swipeLeft}
          >
            <Text style={styles.actionIcon}>👋</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.woofBtn]}
            onPress={handleWoof}
          >
            <Text style={styles.actionIcon}>🐾</Text>
          </TouchableOpacity>
        </View>
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
  filterIcon: { fontSize: 22 },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
    paddingBottom: 100,
    paddingTop: SPACING.md,
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...makeShadow(3, 6, 0.2, 4),
  },
  skipBtn: { backgroundColor: '#fff' },
  woofBtn: { backgroundColor: COLORS.primary },
  actionIcon: { fontSize: 28 },
});
