import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

interface ModalProps {
  title?: string;
  onClose?: () => void;
  snapPoints?: (string | number)[];
  children: React.ReactNode;
  bottomSheetRef: React.RefObject<BottomSheet>;
}

export function Modal({
  title,
  onClose,
  snapPoints = ['50%', '90%'],
  children,
  bottomSheetRef,
}: ModalProps) {
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={onClose}
      />
    ),
    [onClose],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.background}
    >
      <BottomSheetView style={styles.container}>
        {(title || onClose) && (
          <View style={styles.header}>
            {title ? <Text style={styles.title}>{title}</Text> : <View />}
            {onClose && (
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: COLORS.surface, borderRadius: 20 },
  handle: { backgroundColor: COLORS.border, width: 40 },
  container: { flex: 1, paddingHorizontal: SPACING.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  close: { fontSize: 18, color: COLORS.textLight },
});
