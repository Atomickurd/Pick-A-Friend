import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ViewStyle, ImageStyle, StyleProp } from 'react-native';
import { COLORS } from '../../constants/colors';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export function Avatar({ uri, name, size = 48, style }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const containerStyle: ImageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: 'hidden',
  };

  if (uri && !errored) {
    return (
      <Image
        source={{ uri }}
        style={[containerStyle, style]}
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <View style={[containerStyle as ViewStyle, styles.placeholder, style as ViewStyle]}>
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: COLORS.primary, fontWeight: '700' },
});
