import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  secureToggle?: boolean; // show eye icon for password fields
}

export function Input({
  label,
  error,
  hint,
  secureToggle,
  secureTextEntry,
  style,
  ...rest
}: InputProps) {
  const [secure, setSecure] = useState(secureTextEntry ?? false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.row, error ? styles.rowError : styles.rowNormal]}>
        <TextInput
          {...rest}
          secureTextEntry={secure}
          placeholderTextColor={COLORS.textLight}
          style={[styles.input, style]}
          autoCapitalize={secureToggle ? 'none' : rest.autoCapitalize}
        />
        {secureToggle ? (
          <TouchableOpacity
            onPress={() => setSecure((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.eyeIcon}>{secure ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: SPACING.md },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    minHeight: 48,
  },
  rowNormal: { borderColor: COLORS.border },
  rowError: { borderColor: COLORS.error },
  input: { flex: 1, fontSize: 16, color: COLORS.text, paddingVertical: 10 },
  eyeIcon: { fontSize: 18, marginLeft: SPACING.sm },
  error: { marginTop: 4, fontSize: 12, color: COLORS.error },
  hint: { marginTop: 4, fontSize: 12, color: COLORS.textLight },
});
