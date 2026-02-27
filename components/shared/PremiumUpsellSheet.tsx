import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { premiumBenefits } from '../../constants/premiumBenefits';
import { startPremiumSubscription } from '../../services/stripe';
import { useUserStore } from '../../store/user';

interface PremiumUpsellSheetProps {
  highlightFeature?: string;
  onClose: () => void;
  sheetRef: React.RefObject<BottomSheet>;
}

export function PremiumUpsellSheet({
  highlightFeature,
  onClose,
  sheetRef,
}: PremiumUpsellSheetProps) {
  const updateUser = useUserStore((s) => s.updateUser);

  async function handleUpgrade() {
    const result = await startPremiumSubscription();
    if (result === 'success') {
      updateUser({ subscriptionTier: 'premium' });
      onClose();
    }
  }

  return (
    <Modal
      bottomSheetRef={sheetRef}
      title="Go Premium"
      onClose={onClose}
      snapPoints={['70%']}
    >
      <View style={styles.content}>
        <Text style={styles.tagline}>Unlock everything for your pup 🐾</Text>
        {highlightFeature && (
          <View style={styles.highlightBadge}>
            <Text style={styles.highlightText}>✨ {highlightFeature}</Text>
          </View>
        )}
        <View style={styles.benefits}>
          {Object.entries(premiumBenefits)
            .filter(([k]) => k !== 'default')
            .slice(0, 5)
            .map(([key, b]) => (
              <View key={key} style={styles.benefitRow}>
                <Text style={styles.benefitIcon}>{b.illustration}</Text>
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>{b.headline}</Text>
                  <Text style={styles.benefitDesc}>{b.subtitle}</Text>
                </View>
              </View>
            ))}
        </View>
        <Text style={styles.price}>Only £4.99 / month</Text>
        <Button
          label="Start Premium"
          onPress={handleUpgrade}
          fullWidth
          style={styles.upgradeBtn}
        />
        <Button
          label="Maybe Later"
          onPress={onClose}
          variant="ghost"
          fullWidth
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: { gap: SPACING.md },
  tagline: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  highlightBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    alignSelf: 'center',
  },
  highlightText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  benefits: { gap: SPACING.sm },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  benefitIcon: { fontSize: 28 },
  benefitText: { flex: 1 },
  benefitTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  benefitDesc: { fontSize: 13, color: COLORS.textLight },
  price: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginVertical: SPACING.sm,
  },
  upgradeBtn: { marginTop: SPACING.xs },
});
