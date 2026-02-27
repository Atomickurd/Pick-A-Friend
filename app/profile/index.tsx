import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDogStore, selectActiveDog } from '../../store/dog';
import { useUserStore } from '../../store/user';
import { BadgeChip } from '../../components/shared/BadgeChip';
import { Button } from '../../components/ui/Button';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

export default function OwnProfileScreen() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const activeDog = useDogStore(selectActiveDog);
  const dogs = useDogStore((s) => s.dogs);
  const setActiveDogId = useDogStore((s) => s.setActiveDogId);

  if (!activeDog) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🐶</Text>
          <Text style={styles.emptyText}>No dog profile yet</Text>
          <Button
            label="Add a Dog"
            onPress={() => router.push('/auth/onboard/dog-basics' as never)}
          />
        </View>
      </SafeAreaView>
    );
  }

  const age = (() => {
    const months =
      (Date.now() - new Date(activeDog.dateOfBirth).getTime()) /
      (1000 * 60 * 60 * 24 * 30.4);
    return months < 12 ? `${Math.round(months)}mo` : `${(months / 12).toFixed(1)}y`;
  })();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
          <TouchableOpacity onPress={() => router.push('/settings/index' as never)}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Dog switcher */}
        {dogs.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dogSwitcher} contentContainerStyle={styles.dogSwitcherInner}>
            {dogs.map((dog) => (
              <TouchableOpacity
                key={dog.id}
                onPress={() => setActiveDogId(dog.id)}
                style={[styles.switcherChip, activeDog.id === dog.id && styles.switcherChipActive]}
              >
                <Text style={[styles.switcherText, activeDog.id === dog.id && styles.switcherTextActive]}>
                  {dog.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Hero photo */}
        <View style={styles.heroArea}>
          <Image
            source={{ uri: activeDog.photoURLs[0] ?? 'https://placedog.net/300' }}
            style={styles.heroPhoto}
          />
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push('/profile/edit' as never)}
          >
            <Text style={styles.editBtnText}>✏️ Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Bio */}
        <Text style={styles.dogName}>{activeDog.name}</Text>
        <Text style={styles.dogMeta}>
          {activeDog.breed} · {age} · {activeDog.gender === 'male' ? '♂ Boy' : '♀ Girl'} · {activeDog.size}
        </Text>
        {activeDog.bio ? (
          <Text style={styles.bio}>{activeDog.bio}</Text>
        ) : null}

        {/* Traits */}
        {activeDog.traits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personality</Text>
            <View style={styles.chips}>
              {activeDog.traits.map((t) => (
                <View key={t} style={styles.traitPill}>
                  <Text style={styles.traitText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Badges */}
        {activeDog.badges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Badges</Text>
            <View style={styles.chips}>
              {activeDog.badges.map((b) => <BadgeChip key={b} badgeKey={b} />)}
            </View>
          </View>
        )}

        {/* Owner info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Owner</Text>
          <Text style={styles.ownerName}>{user?.displayName}</Text>
          {user?.neighbourhood ? (
            <Text style={styles.location}>📍 {user.neighbourhood}, {user.city}</Text>
          ) : user?.city ? (
            <Text style={styles.location}>📍 {user.city}</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  settingsIcon: { fontSize: 22 },
  dogSwitcher: { maxHeight: 48, marginBottom: SPACING.sm },
  dogSwitcherInner: { paddingHorizontal: SPACING.lg, gap: SPACING.xs },
  switcherChip: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  switcherChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  switcherText: { fontSize: 14, color: COLORS.textLight, fontWeight: '600' },
  switcherTextActive: { color: '#fff' },
  heroArea: { position: 'relative', marginHorizontal: SPACING.lg, marginBottom: SPACING.md },
  heroPhoto: { width: '100%', height: 300, borderRadius: 20 },
  editBtn: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  editBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  dogName: { fontSize: 28, fontWeight: '900', color: COLORS.text, paddingHorizontal: SPACING.lg },
  dogMeta: { fontSize: 15, color: COLORS.textLight, paddingHorizontal: SPACING.lg, marginTop: 2 },
  bio: { fontSize: 15, color: COLORS.text, lineHeight: 22, paddingHorizontal: SPACING.lg, marginTop: SPACING.sm },
  section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  traitPill: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  traitText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  ownerName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  location: { fontSize: 14, color: COLORS.textLight, marginTop: 2 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md },
  emptyEmoji: { fontSize: 64 },
  emptyText: { fontSize: 20, fontWeight: '700', color: COLORS.text },
});
