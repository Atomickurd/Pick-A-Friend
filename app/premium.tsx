import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { premiumBenefits } from '../constants/premiumBenefits';
import { startPremiumSubscription } from '../services/stripe';
import { useUserStore } from '../store/user';

export default function PremiumScreen() {
  const router = useRouter();
  const updateUser = useUserStore((s) => s.updateUser);
  const isPremium = useUserStore((s) => s.user?.subscriptionTier === 'premium');

  async function handleUpgrade() {
    const result = await startPremiumSubscription();
    if (result === 'success') {
      updateUser({ subscriptionTier: 'premium' });
      router.back();
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.crown}>👑</Text>
        <Text style={styles.title}>PickAFriend Premium</Text>
        <Text style={styles.subtitle}>
          Unlock the full potential of your dog's social life
        </Text>

        {isPremium ? (
          <View style={styles.alreadyPremium}>
            <Text style={styles.alreadyText}>✅ You're already a Premium member!</Text>
          </View>
        ) : (
          <>
            <View style={styles.benefits}>
              {Object.entries(premiumBenefits)
                .filter(([k]) => k !== 'default')
                .map(([key, benefit]) => (
                  <View key={key} style={styles.benefitRow}>
                    <Text style={styles.benefitIllustration}>{benefit.illustration}</Text>
                    <View style={styles.benefitText}>
                      <Text style={styles.benefitHeadline}>{benefit.headline}</Text>
                      <Text style={styles.benefitSubtitle}>{benefit.subtitle}</Text>
                    </View>
                  </View>
                ))}
            </View>

            <View style={styles.pricing}>
              <Text style={styles.price}>£4.99</Text>
              <Text style={styles.pricePeriod}>per month · cancel anytime</Text>
            </View>

            <Button
              label="🐾 Start Premium"
              onPress={handleUpgrade}
              fullWidth
              style={styles.ctaBtn}
            />
            <Button
              label="Maybe Later"
              onPress={() => router.back()}
              variant="ghost"
              fullWidth
            />

            <Text style={styles.legal}>
              Recurring billing. Cancel anytime in Account Settings.
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  closeBtn: {
    position: 'absolute',
    top: 60,
    right: SPACING.lg,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontSize: 16, color: COLORS.text, fontWeight: '700' },
  container: { padding: SPACING.lg, alignItems: 'center', gap: SPACING.lg, paddingBottom: 100 },
  crown: { fontSize: 64 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.text, textAlign: 'center' },
  subtitle: { fontSize: 16, color: COLORS.textLight, textAlign: 'center', lineHeight: 22 },
  benefits: { width: '100%', gap: SPACING.md },
  benefitRow: { flexDirection: 'row', gap: SPACING.md, alignItems: 'flex-start' },
  benefitIllustration: { fontSize: 36 },
  benefitText: { flex: 1 },
  benefitHeadline: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  benefitSubtitle: { fontSize: 13, color: COLORS.textLight },
  pricing: { alignItems: 'center' },
  price: { fontSize: 40, fontWeight: '900', color: COLORS.primary },
  pricePeriod: { fontSize: 14, color: COLORS.textLight },
  ctaBtn: { marginTop: SPACING.sm },
  legal: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  alreadyPremium: {
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  alreadyText: { fontSize: 18, fontWeight: '700', color: '#15803d' },
});
