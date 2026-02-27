import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/shared/EmptyState';
import { fsQuery } from '../../services/firebase/firestore';
import { useUserStore } from '../../store/user';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import type { MessageChannel } from '../../types';

export default function MessagesListScreen() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const [channels, setChannels] = useState<MessageChannel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const { where, orderBy, limit } = require('firebase/firestore');
    const unsub = fsQuery<MessageChannel>(
      'message_channels',
      [
        where('participantUids', 'array-contains', user.uid),
        orderBy('lastMessageAt', 'desc'),
        limit(50),
      ],
      (items) => {
        setChannels(items);
        setLoading(false);
      },
    );
    return unsub;
  }, [user?.uid]);

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <ActivityIndicator size="large" color={COLORS.primary} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages 💬</Text>
      </View>

      <FlatList
        data={channels}
        keyExtractor={(c) => c.id}
        renderItem={({ item: channel }) => {
          const unread = channel.unreadCounts[user?.uid ?? ''] ?? 0;
          return (
            <TouchableOpacity
              style={styles.channelRow}
              onPress={() => router.push(`/messages/${channel.id}` as never)}
            >
              <Avatar size={50} />
              <View style={styles.channelBody}>
                <Text style={styles.channelName}>
                  {channel.participantDogIds.join(', ')}
                </Text>
                <Text style={styles.lastMsg} numberOfLines={1}>
                  {channel.lastMessage}
                </Text>
              </View>
              {unread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            emoji="💬"
            headline="No conversations yet"
            subtext="Send a Paw Request to start chatting!"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  channelBody: { flex: 1 },
  channelName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  lastMsg: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
