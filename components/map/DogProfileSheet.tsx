import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { BadgeChip } from '../shared/BadgeChip';
import { Button } from '../ui/Button';
import type { DogProfile, MatchScore } from '../../types';

interface DogProfileSheetProps {
  dog: DogProfile | null;
  matchScore: MatchScore | null;
  onClose: () => void;
  bottomSheetRef: React.RefObject<BottomSheet>;
}

export function DogProfileSheet({
  dog,
  matchScore,
  onClose,
  bottomSheetRef,
}: DogProfileSheetProps) {
  const router = useRouter();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} onPress={onClose} />
    ),
    [onClose],
  );

  if (!dog) return null;

  const age = (() => {
    const months =
      (new Date().getTime() - new Date(dog.dateOfBirth).getTime()) /
      (1000 * 60 * 60 * 24 * 30.4);
    if (months < 12) return `${Math.round(months)}mo`;
    return `${(months / 12).toFixed(1)}y`;
  })();

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['50%', '85%']}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: COLORS.border, width: 40 }}
      backgroundStyle={{ backgroundColor: COLORS.surface, borderRadius: 20 }}
    >
      <BottomSheetView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image
              source={{ uri: dog.photoURLs[0] ?? 'https://placedog.net/200' }}
              style={styles.photo}
            />
            <View style={styles.headerText}>
              <Text style={styles.name}>{dog.name}</Text>
              <Text style={styles.meta}>
                {dog.breed} · {age} · {dog.gender === 'male' ? '♂' : '♀'}
              </Text>
              {matchScore && (
                <View style={styles.scorePill}>
                  <Text style={styles.scoreText}>
                    {Math.round(matchScore.score)}% match ✨
                  </Text>
                </View>
              )}
            </View>
          </View>

          {dog.bio ? (
            <Text style={styles.bio}>{dog.bio}</Text>
          ) : null}

          {dog.traits.length > 0 && (
            <View style={styles.traits}>
              {dog.traits.map((t) => (
                <View key={t} style={styles.traitPill}>
                  <Text style={styles.traitText}>{t}</Text>
                </View>
              ))}
            </View>
          )}

          {dog.badges.length > 0 && (
            <View style={styles.badges}>
              {dog.badges.map((b) => (
                <BadgeChip key={b} badgeKey={b} />
              ))}
            </View>
          )}

          <View style={styles.actions}>
            <Button
              label="🐾 Send Paw Request"
              onPress={() => {
                onClose();
                router.push(`/profile/${dog.id}` as never);
              }}
              fullWidth
            />
            <Button
              label="View Full Profile"
              onPress={() => {
                onClose();
                router.push(`/profile/${dog.id}` as never);
              }}
              variant="secondary"
              fullWidth
            />
          </View>
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
  header: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  photo: { width: 80, height: 80, borderRadius: 40 },
  headerText: { flex: 1, justifyContent: 'center', gap: 4 },
  name: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  meta: { fontSize: 13, color: COLORS.textLight },
  scorePill: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  scoreText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  bio: { fontSize: 14, color: COLORS.textLight, lineHeight: 20, marginBottom: SPACING.md },
  traits: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md },
  traitPill: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  traitText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md },
  actions: { gap: SPACING.sm, marginTop: SPACING.md },
});
