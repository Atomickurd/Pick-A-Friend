import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '../ui/Avatar';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { makeShadow } from '../../constants/shadow';
import { reactToPost } from '../../services/api/feed';
import type { Post, ReactionType } from '../../types';

const REACTIONS: { type: ReactionType; emoji: string }[] = [
  { type: 'woof', emoji: '🐕' },
  { type: 'heart', emoji: '❤️' },
  { type: 'paw', emoji: '🐾' },
  { type: 'laugh', emoji: '😂' },
  { type: 'wow', emoji: '😮' },
];

interface PostCardProps {
  post: Post;
  onUpdate: (id: string, partial: Partial<Post>) => void;
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const router = useRouter();
  const [reactLoading, setReactLoading] = useState(false);

  const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0);

  async function handleReact(type: ReactionType) {
    if (reactLoading) return;
    setReactLoading(true);
    const isSame = post.myReaction === type;
    onUpdate(post.id, {
      myReaction: isSame ? null : type,
      reactions: {
        ...post.reactions,
        [type]: post.reactions[type] + (isSame ? -1 : 1),
        ...(post.myReaction && !isSame
          ? { [post.myReaction]: Math.max(0, post.reactions[post.myReaction] - 1) }
          : {}),
      },
    });
    try {
      await reactToPost(post.id, type);
    } finally {
      setReactLoading(false);
    }
  }

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => router.push(`/profile/${post.authorDogId}` as never)}
      >
        <Avatar size={40} name="Dog" />
        <View style={styles.headerText}>
          <Text style={styles.authorName}>Dog #{post.authorDogId.slice(-4)}</Text>
          <Text style={styles.time}>
            {new Date(post.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {post.type === 'event' && (
          <View style={styles.eventBadge}>
            <Text style={styles.eventBadgeText}>📅 Event</Text>
          </View>
        )}
        {post.type === 'lost_alert' && (
          <View style={[styles.eventBadge, styles.lostBadge]}>
            <Text style={styles.eventBadgeText}>🚨 Lost</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Body */}
      {post.text ? <Text style={styles.body}>{post.text}</Text> : null}

      {/* Media */}
      {post.mediaURLs.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
          {post.mediaURLs.map((url, i) => (
            <Image key={i} source={{ uri: url }} style={styles.mediaImage} />
          ))}
        </ScrollView>
      )}

      {/* Reactions */}
      <View style={styles.reactions}>
        <View style={styles.reactionButtons}>
          {REACTIONS.map(({ type, emoji }) => (
            <TouchableOpacity
              key={type}
              onPress={() => handleReact(type)}
              style={[
                styles.reactionBtn,
                post.myReaction === type && styles.reactionBtnActive,
              ]}
            >
              <Text style={styles.reactionEmoji}>{emoji}</Text>
              {post.reactions[type] > 0 && (
                <Text style={styles.reactionCount}>{post.reactions[type]}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
        {totalReactions > 0 && (
          <Text style={styles.totalReactions}>{totalReactions} reactions</Text>
        )}
      </View>

      {/* Comments */}
      <TouchableOpacity style={styles.commentsRow}>
        <Text style={styles.commentsText}>
          💬 {post.commentCount > 0 ? `${post.commentCount} comments` : 'Add a comment'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...makeShadow(1, 4, 0.06, 2),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
  },
  headerText: { flex: 1 },
  authorName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  time: { fontSize: 12, color: COLORS.textLight },
  eventBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  lostBadge: { backgroundColor: '#fee2e2' },
  eventBadgeText: { fontSize: 11, fontWeight: '600', color: COLORS.primary },
  body: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  mediaScroll: { marginBottom: SPACING.sm },
  mediaImage: { width: 280, height: 200, borderRadius: 12, marginLeft: SPACING.md },
  reactions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  reactionButtons: { flexDirection: 'row', gap: SPACING.xs },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: COLORS.background,
  },
  reactionBtnActive: { backgroundColor: COLORS.primaryLight },
  reactionEmoji: { fontSize: 18 },
  reactionCount: { fontSize: 12, fontWeight: '600', color: COLORS.textLight },
  totalReactions: { fontSize: 12, color: COLORS.textLight },
  commentsRow: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.xs,
  },
  commentsText: { fontSize: 13, color: COLORS.textLight },
});
