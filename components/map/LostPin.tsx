import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Colors } from '../../constants/colors';

interface LostPinProps {
  dogName: string;
  onPress: () => void;
}

export function LostPin({ dogName, onPress }: LostPinProps) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.4,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.wrapper}>
      <Animated.View
        style={[styles.pulseRing, { transform: [{ scale: pulse }] }]}
      />
      <View style={styles.circle}>
        <Text style={styles.icon}>🚨</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.name} numberOfLines={1}>LOST: {dogName}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: 2 },
  pulseRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lostPin,
    opacity: 0.3,
    top: -4,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lostPin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 20 },
  label: {
    backgroundColor: Colors.lostPin,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    maxWidth: 90,
  },
  name: { fontSize: 9, fontWeight: '700', color: '#fff', textAlign: 'center' },
});
