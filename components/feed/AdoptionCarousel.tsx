import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import type { AdoptionDog } from '../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.72;

interface AdoptionCarouselProps {
  dogs: AdoptionDog[];
}

export function AdoptionCarousel({ dogs }: AdoptionCarouselProps) {
  const router = useRouter();
  const [active, setActive] = useState(0);

  if (dogs.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🐶 Adopt Me!</Text>
        <TouchableOpacity onPress={() => router.push('/adopt' as never)}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dogs}
        horizontal
        pagingEnabled={false}
        snapToInterval={CARD_WIDTH + SPACING.md}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        onScroll={(e) => {
          const idx = Math.round(
            e.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING.md),
          );
          setActive(idx);
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item: dog }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/adopt' as never)}
            activeOpacity={0.88}
          >
            <Image
              source={{ uri: dog.photoURLs[0] ?? 'https://placedog.net/300' }}
              style={styles.photo}
            />
            <View style={styles.cardBody}>
              <Text style={styles.dogName}>{dog.name}</Text>
              <Text style={styles.dogMeta}>
                {dog.breed} · {Math.round(dog.ageMonths / 12 * 10) / 10}y · {dog.gender}
              </Text>
              <Text style={styles.bio} numberOfLines={2}>{dog.bio}</Text>
              <TouchableOpacity style={styles.adoptBtn}>
                <Text style={styles.adoptBtnText}>❤️ Apply to Adopt</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Dot indicators */}
      <View style={styles.dots}>
        {dogs.map((_, i) => (
          <View key={i} style={[styles.dot, i === active && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: SPACING.md,
    paddingTop: SPACING.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  list: { paddingHorizontal: SPACING.md, gap: SPACING.md, paddingBottom: SPACING.md },
  card: { width: CARD_WIDTH, borderRadius: 12, overflow: 'hidden', backgroundColor: COLORS.background },
  photo: { width: '100%', height: 180 },
  cardBody: { padding: SPACING.sm, gap: 4 },
  dogName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  dogMeta: { fontSize: 12, color: COLORS.textLight },
  bio: { fontSize: 13, color: COLORS.textLight, lineHeight: 18 },
  adoptBtn: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  adoptBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 4, paddingBottom: SPACING.sm },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
  dotActive: { backgroundColor: COLORS.primary, width: 14 },
});
