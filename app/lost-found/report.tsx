import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { fsSet } from '../../services/firebase/firestore';
import { uploadFile } from '../../services/firebase/storage';
import { useUserStore } from '../../store/user';
import type { LostReport } from '../../types';

export default function ReportLostScreen() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const [dogName, setDogName] = useState('');
  const [breed, setBreed] = useState('');
  const [description, setDescription] = useState('');
  const [lastSeen, setLastSeen] = useState('');
  const [contact, setContact] = useState('');
  const [photoURI, setPhotoURI] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) setPhotoURI(result.assets[0].uri);
  }

  async function handleSubmit() {
    if (!dogName || !breed || !lastSeen || !contact) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const reportId = `report_${Date.now()}`;
      let photoURL = '';
      if (photoURI) {
        photoURL = await uploadFile(`lost_reports/${reportId}/photo.jpg`, photoURI);
      }

      const report: LostReport = {
        id: reportId,
        reporterUid: user.uid,
        dogId: null,
        dogName: dogName.trim(),
        dogBreed: breed.trim(),
        dogPhotoURL: photoURL,
        dogDescription: description.trim(),
        status: 'lost',
        lastSeenLatitude: 0,
        lastSeenLongitude: 0,
        lastSeenAddress: lastSeen.trim(),
        lastSeenAt: new Date().toISOString(),
        rewardOffered: false,
        rewardAmount: null,
        contactPhone: contact.trim(),
        sightings: [],
        isBroadcast: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await fsSet(`lost_reports/${reportId}`, report);
      router.replace(`/lost-found/${reportId}` as never);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Report Lost Dog 🚨</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.photoArea} onPress={pickPhoto}>
            {photoURI ? (
              <Image source={{ uri: photoURI }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.cameraIcon}>📷</Text>
                <Text style={styles.photoHint}>Add dog photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <Input label="Dog's name *" value={dogName} onChangeText={setDogName} placeholder="Max" />
          <Input label="Breed *" value={breed} onChangeText={setBreed} placeholder="Labrador" />
          <Input label="Description *" value={description} onChangeText={setDescription} multiline placeholder="Colour, distinguishing features..." style={{ height: 80, textAlignVertical: 'top' }} />
          <Input label="Last seen location *" value={lastSeen} onChangeText={setLastSeen} placeholder="123 High Street, London" />
          <Input label="Contact phone *" value={contact} onChangeText={setContact} keyboardType="phone-pad" placeholder="+44 7700 900123" />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button label="Submit Report" onPress={handleSubmit} loading={loading} fullWidth />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  back: { color: COLORS.textLight, fontSize: 16 },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  container: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 100 },
  photoArea: { alignSelf: 'center', marginBottom: SPACING.sm },
  photo: { width: 140, height: 140, borderRadius: 12 },
  photoPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  cameraIcon: { fontSize: 40 },
  photoHint: { fontSize: 12, color: COLORS.primary },
  error: { color: COLORS.error, fontSize: 13 },
});
