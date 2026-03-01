import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { makeShadow } from '../../constants/shadow';
import type { MatchResult } from '../../services/api/matching';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.28;

interface SwipeCardProps {
  result: MatchResult;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  isTop: boolean;
}

export function SwipeCard({ result, onSwipeRight, onSwipeLeft, isTop }: SwipeCardProps) {
  const { dog, match } = result;
  const pan = useRef(new Animated.ValueXY()).current;

  const rotate = pan.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => isTop,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, { dx }) => {
      if (dx > SWIPE_THRESHOLD) {
        Animated.timing(pan, {
          toValue: { x: width * 1.5, y: 0 },
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          pan.setValue({ x: 0, y: 0 });
          onSwipeRight();
        });
      } else if (dx < -SWIPE_THRESHOLD) {
        Animated.timing(pan, {
          toValue: { x: -width * 1.5, y: 0 },
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          pan.setValue({ x: 0, y: 0 });
          onSwipeLeft();
        });
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const age = (() => {
    const months =
      (Date.now() - new Date(dog.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30.4);
    return months < 12 ? `${Math.round(months)}mo` : `${(months / 12).toFixed(1)}y`;
  })();

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.card,
        isTop && {
          transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
        },
      ]}
    >
      <Image
        source={{ uri: dog.photoURLs[0] ?? 'https://placedog.net/400/600' }}
        style={styles.photo}
        resizeMode="cover"
      />

      {/* Swipe indicators */}
      <Animated.View style={[styles.badge, styles.likeBadge, { opacity: likeOpacity }]}>
        <Text style={styles.badgeText}>WOOF! 🐾</Text>
      </Animated.View>
      <Animated.View style={[styles.badge, styles.nopeBadge, { opacity: nopeOpacity }]}>
        <Text style={styles.badgeText}>SKIP 👋</Text>
      </Animated.View>

      {/* Card footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.name}>{dog.name}, {age}</Text>
          <Text style={styles.breed}>{dog.breed}</Text>
          <View style={styles.traits}>
            {dog.traits.slice(0, 3).map((t) => (
              <View key={t} style={styles.traitPill}>
                <Text style={styles.traitText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.scorePill}>
          <Text style={styles.scoreText}>{Math.round(match.score)}%</Text>
          <Text style={styles.scoreLabel}>match</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const CARD_HEIGHT = Dimensions.get('window').height * 0.62;

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: width - SPACING.lg * 2,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    ...makeShadow(4, 12, 0.2, 6),
  },
  photo: { width: '100%', height: '100%', position: 'absolute' },
  badge: {
    position: 'absolute',
    top: 50,
    borderWidth: 4,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  likeBadge: { right: SPACING.lg, borderColor: '#22c55e' },
  nopeBadge: { left: SPACING.lg, borderColor: '#ef4444' },
  badgeText: { fontSize: 22, fontWeight: '900', color: '#fff' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  footerLeft: { flex: 1, gap: 4 },
  name: { fontSize: 24, fontWeight: '800', color: '#fff' },
  breed: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  traits: { flexDirection: 'row', gap: SPACING.xs, flexWrap: 'wrap' },
  traitPill: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  traitText: { fontSize: 11, color: '#fff', fontWeight: '600' },
  scorePill: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    minWidth: 52,
  },
  scoreText: { fontSize: 22, fontWeight: '900', color: '#fff' },
  scoreLabel: { fontSize: 10, color: 'rgba(255,255,255,0.8)' },
});
