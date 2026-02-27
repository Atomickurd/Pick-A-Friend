import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../../constants/colors';
import type { MoodStatus } from '../../types';

const MOOD_BORDER: Record<MoodStatus, string> = {
  happy: Colors.green,
  playful: Colors.amber,
  calm: Colors.teal,
  tired: Colors.midGray,
  grumpy: Colors.red,
};

interface DogPinProps {
  name: string;
  photoURL: string | null;
  moodStatus: MoodStatus;
  isBirthday: boolean;
  onPress: () => void;
}

export function DogPin({ name, photoURL, moodStatus, isBirthday, onPress }: DogPinProps) {
  const borderColor = MOOD_BORDER[moodStatus] ?? Colors.midGray;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.wrapper}>
      {isBirthday && <Text style={styles.balloon}>🎈</Text>}
      <View style={[styles.circle, { borderColor }]}>
        {photoURL ? (
          <Image source={{ uri: photoURL }} style={styles.photo} />
        ) : (
          <Text style={styles.fallback}>🐕</Text>
        )}
      </View>
      <View style={styles.label}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: 2 },
  balloon: { fontSize: 18, position: 'absolute', top: -20, right: -6 },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    overflow: 'hidden',
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: { width: '100%', height: '100%' },
  fallback: { fontSize: 24 },
  label: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    maxWidth: 72,
  },
  name: { fontSize: 10, fontWeight: '600', color: Colors.dark, textAlign: 'center' },
});
