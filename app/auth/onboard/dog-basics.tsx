import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { BREEDS } from '../../../constants/breeds';
import { useDogStore } from '../../../store/dog';
import { useUserStore } from '../../../store/user';
import { uploadFile } from '../../../services/firebase/storage';
import { fsSet } from '../../../services/firebase/firestore';
import type { DogProfile, Gender, DogSize } from '../../../types';

type Step1Fields = {
  name: string;
  breed: string;
  gender: Gender | '';
  weightKg: string;
  photoURI: string | null;
};

const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: '♂ Boy', value: 'male' },
  { label: '♀ Girl', value: 'female' },
];

const SIZE_OPTIONS: { label: string; value: DogSize }[] = [
  { label: 'Tiny', value: 'tiny' },
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'Giant', value: 'giant' },
];

export default function DogBasicsScreen() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const addDog = useDogStore((s) => s.addDog);

  const [fields, setFields] = useState<Step1Fields>({
    name: '',
    breed: '',
    gender: '',
    weightKg: '',
    photoURI: null,
  });
  const [size, setSize] = useState<DogSize | null>(null);
  const [dob, setDob] = useState(''); // YYYY-MM-DD
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof Step1Fields, v: string) =>
    setFields((f) => ({ ...f, [k]: v }));

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      aspect: [1, 1],
      allowsEditing: true,
    });
    if (!result.canceled) set('photoURI', result.assets[0].uri);
  }

  async function handleNext() {
    if (!fields.name || !fields.breed || !fields.gender || !size || !dob) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const dogId = `${user.uid}_${Date.now()}`;
      let photoURL = '';
      if (fields.photoURI) {
        photoURL = await uploadFile(
          `dogs/${dogId}/photo_0.jpg`,
          fields.photoURI,
        );
      }

      const dog: DogProfile = {
        id: dogId,
        ownerUid: user.uid,
        name: fields.name.trim(),
        breed: fields.breed,
        gender: fields.gender as Gender,
        dateOfBirth: dob,
        weightKg: parseFloat(fields.weightKg) || 0,
        size,
        photoURLs: photoURL ? [photoURL] : [],
        bio: '',
        traits: [],
        badges: [],
        energyLevel: 'medium',
        dogSocialPref: 'loves',
        humanSocialPref: 'loves',
        isNeutered: false,
        isMicrochipped: false,
        vaccinated: false,
        moodStatus: 'happy',
        moodUpdatedAt: new Date().toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await fsSet(`dogs/${dogId}`, dog);
      addDog(dog);
      router.push('/auth/onboard/personality');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save dog profile');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.stepIndicator}>Step 1 of 5</Text>
      <Text style={styles.title}>Tell us about your pup 🐶</Text>

      <TouchableOpacity style={styles.photoArea} onPress={pickPhoto}>
        {fields.photoURI ? (
          <Image source={{ uri: fields.photoURI }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.cameraIcon}>📷</Text>
            <Text style={styles.photoHint}>Add a photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Input label="Dog's name *" value={fields.name} onChangeText={(v) => set('name', v)} placeholder="Buddy" />
      <Input label="Breed *" value={fields.breed} onChangeText={(v) => set('breed', v)} placeholder="Golden Retriever" />
      <Input label="Date of birth (YYYY-MM-DD) *" value={dob} onChangeText={setDob} placeholder="2021-06-15" keyboardType="numbers-and-punctuation" />
      <Input label="Weight (kg)" value={fields.weightKg} onChangeText={(v) => set('weightKg', v)} keyboardType="decimal-pad" placeholder="8.5" />

      <Text style={styles.sectionLabel}>Gender *</Text>
      <View style={styles.pills}>
        {GENDER_OPTIONS.map((o) => (
          <TouchableOpacity
            key={o.value}
            style={[styles.pill, fields.gender === o.value && styles.pillActive]}
            onPress={() => set('gender', o.value)}
          >
            <Text style={[styles.pillLabel, fields.gender === o.value && styles.pillLabelActive]}>
              {o.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Size *</Text>
      <View style={styles.pills}>
        {SIZE_OPTIONS.map((o) => (
          <TouchableOpacity
            key={o.value}
            style={[styles.pill, size === o.value && styles.pillActive]}
            onPress={() => setSize(o.value)}
          >
            <Text style={[styles.pillLabel, size === o.value && styles.pillLabelActive]}>
              {o.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button label="Next →" onPress={handleNext} loading={loading} fullWidth style={styles.nextBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  stepIndicator: { fontSize: 13, color: COLORS.textLight, alignSelf: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.sm },
  photoArea: { alignSelf: 'center', marginBottom: SPACING.sm },
  photo: { width: 120, height: 120, borderRadius: 60 },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  cameraIcon: { fontSize: 32 },
  photoHint: { fontSize: 11, color: COLORS.primary, marginTop: 4 },
  sectionLabel: { fontSize: 14, fontWeight: '500', color: COLORS.text },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  pill: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  pillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  pillLabel: { fontSize: 14, color: COLORS.textLight },
  pillLabelActive: { color: '#fff', fontWeight: '600' },
  error: { color: COLORS.error, fontSize: 13 },
  nextBtn: { marginTop: SPACING.md },
});
