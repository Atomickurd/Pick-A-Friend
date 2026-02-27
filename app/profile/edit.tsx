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
import { useDogStore, selectActiveDog } from '../../store/dog';
import { fsUpdate } from '../../services/firebase/firestore';
import { uploadFile } from '../../services/firebase/storage';

export default function EditProfileScreen() {
  const router = useRouter();
  const activeDog = useDogStore(selectActiveDog);
  const updateDog = useDogStore((s) => s.updateDog);

  const [name, setName] = useState(activeDog?.name ?? '');
  const [bio, setBio] = useState(activeDog?.bio ?? '');
  const [photoURI, setPhotoURI] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      aspect: [1, 1],
      allowsEditing: true,
    });
    if (!result.canceled) setPhotoURI(result.assets[0].uri);
  }

  async function handleSave() {
    if (!activeDog) return;
    setLoading(true);
    try {
      const updates: Partial<typeof activeDog> = { name: name.trim(), bio: bio.trim() };
      if (photoURI) {
        const url = await uploadFile(
          `dogs/${activeDog.id}/photo_0.jpg`,
          photoURI,
        );
        updates.photoURLs = [url, ...activeDog.photoURLs.slice(1)];
      }
      await fsUpdate(`dogs/${activeDog.id}`, updates);
      updateDog(activeDog.id, updates);
      router.back();
    } finally {
      setLoading(false);
    }
  }

  if (!activeDog) return null;

  const displayPhoto = photoURI ?? activeDog.photoURLs[0];

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <Button label="Save" onPress={handleSave} loading={loading} style={styles.saveBtn} />
        </View>

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.photoArea} onPress={pickPhoto}>
            {displayPhoto ? (
              <Image source={{ uri: displayPhoto }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            )}
            <View style={styles.photoOverlay}>
              <Text style={styles.photoOverlayText}>Change Photo</Text>
            </View>
          </TouchableOpacity>

          <Input label="Name" value={name} onChangeText={setName} autoCapitalize="words" />
          <Input
            label="Bio"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            placeholder="Tell the world about your pup..."
            style={{ height: 100, textAlignVertical: 'top' }}
          />
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cancel: { fontSize: 16, color: COLORS.textLight },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  saveBtn: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md },
  container: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 100 },
  photoArea: { alignSelf: 'center', position: 'relative', marginBottom: SPACING.md },
  photo: { width: 120, height: 120, borderRadius: 60 },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: { fontSize: 40 },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoOverlayText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
