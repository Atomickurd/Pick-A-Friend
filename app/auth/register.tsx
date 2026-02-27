import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { firebaseAuth } from '../../services/firebase/auth';
import { fsSet } from '../../services/firebase/firestore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import type { UserProfile } from '../../types';

export default function RegisterScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    if (!displayName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { user } = await firebaseAuth.register(email.trim(), password);
      await firebaseAuth.updateDisplayName(user, displayName.trim());

      const profile: UserProfile = {
        uid: user.uid,
        email: user.email ?? email,
        displayName: displayName.trim(),
        photoURL: null,
        city: '',
        neighbourhood: '',
        subscriptionTier: 'free',
        subscriptionExpiry: null,
        stripeCustomerId: null,
        pushToken: null,
        privacySettings: {
          showOnMap: true,
          showLastSeen: true,
          allowPawRequests: true,
          allowMessages: 'everyone',
          showInFeed: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await fsSet(`users/${user.uid}`, profile);
      router.replace('/auth/onboard/dog-basics');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>🐾</Text>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>{"First, let's set up your account"}</Text>

        <View style={styles.form}>
          <Input
            label="Your name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Alex"
            autoCapitalize="words"
          />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            secureToggle
            placeholder="Min. 8 characters"
            hint="Use a mix of letters, numbers and symbols"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            label="Create Account"
            onPress={handleRegister}
            loading={loading}
            fullWidth
          />
        </View>

        <TouchableOpacity
          style={styles.loginRow}
          onPress={() => router.back()}
        >
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.link}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flexGrow: 1,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  logo: { fontSize: 64, marginBottom: SPACING.sm },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 15, color: COLORS.textLight, marginBottom: SPACING.sm },
  form: { width: '100%', gap: SPACING.sm },
  error: { color: COLORS.error, fontSize: 13 },
  link: { color: COLORS.primary, fontWeight: '600' },
  loginRow: { marginTop: SPACING.md },
  loginText: { fontSize: 14, color: COLORS.textLight },
});
