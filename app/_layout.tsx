import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { STRIPE_PUBLISHABLE_KEY } from '../lib/stripe';
import { StripeProvider } from '@stripe/stripe-react-native';
import { initSentry } from '../lib/sentry';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from '../hooks/useLocation';
import { configureForegroundHandler } from '../services/firebase/messaging';
import { COLORS } from '../constants/colors';

initSentry();
configureForegroundHandler();

function AppShell() {
  useAuth();
  useLocation();

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="auth/onboard/dog-basics" />
      <Stack.Screen name="auth/onboard/personality" />
      <Stack.Screen name="auth/onboard/social-prefs" />
      <Stack.Screen name="auth/onboard/owner" />
      <Stack.Screen name="auth/onboard/permissions" />
      <Stack.Screen name="profile/[dogId]" options={{ presentation: 'modal' }} />
      <Stack.Screen name="messages/[channelId]" />
      <Stack.Screen name="premium" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY} merchantIdentifier="merchant.com.pickafriend">
        <BottomSheetModalProvider>
          <StatusBar style="dark" />
          <AppShell />
        </BottomSheetModalProvider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
