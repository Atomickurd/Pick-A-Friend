import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { PostCard } from '../../components/feed/PostCard';
import { SmartMatchWidget } from '../../components/feed/SmartMatchWidget';
import { SkeletonCard } from '../../components/shared/SkeletonLoader';
import { EmptyState } from '../../components/shared/EmptyState';
import { useFeedStore } from '../../store/feed';
import { fetchFeed } from '../../services/api/feed';
import { fetchMatches } from '../../services/api/matching';
import { useDogStore, selectActiveDog } from '../../store/dog';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import type { Post } from '../../types';
import type { MatchResult } from '../../services/api/matching';
import { useState } from 'react';

export default function FeedScreen() {
  const router = useRouter();
  const { items, isLoading, isRefreshing, hasMore, cursor, setItems, appendItems, updateItem, setCursor, setLoading, setRefreshing, setHasMore } = useFeedStore();
  const activeDog = useDogStore(selectActiveDog);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  const load = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
      try {
        const page = await fetchFeed(null);
        setItems(page.items);
        setCursor(page.cursor);
        setHasMore(page.hasMore);
      } finally {
        setRefreshing(false);
      }
    } else {
      if (isLoading || !hasMore) return;
      setLoading(true);
      try {
        const page = await fetchFeed(cursor);
        appendItems(page.items);
        setCursor(page.cursor);
        setHasMore(page.hasMore);
      } finally {
        setLoading(false);
      }
    }
  }, [cursor, hasMore, isLoading]);

  useEffect(() => {
    load(true);
    if (activeDog) {
      fetchMatches(activeDog.id).then(setMatches).catch(() => {});
    }
  }, [activeDog?.id]);

  const ListHeader = (
    <View>
      <View style={styles.header}>
        <Text style={styles.logo}>🐾 PickAFriend</Text>
        <TouchableOpacity onPress={() => router.push('/messages/index' as never)}>
          <Text style={styles.headerIcon}>💬</Text>
        </TouchableOpacity>
      </View>
      <SmartMatchWidget matches={matches} onSeeAll={() => router.push('/(tabs)/match')} />
    </View>
  );

  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.logo}>🐾 PickAFriend</Text>
        </View>
        {[1, 2, 3].map((k) => <SkeletonCard key={k} style={styles.skeletonCard} />)}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onUpdate={(id, partial) => updateItem(id, partial as Partial<Post>)}
          />
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => load(true)}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={() => load(false)}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <EmptyState
            emoji="🐾"
            headline="Your feed is quiet"
            subtext="Follow other dogs or attend events to see posts here."
          />
        }
      />

      {/* FAB: create post */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>✏️</Text>
      </TouchableOpacity>
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
  logo: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  headerIcon: { fontSize: 24 },
  list: { paddingHorizontal: SPACING.md, paddingBottom: 100 },
  skeletonCard: { marginHorizontal: SPACING.md, marginTop: SPACING.md },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: SPACING.lg,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: { fontSize: 22 },
});
