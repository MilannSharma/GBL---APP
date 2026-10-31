import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/core/theme';
import { shiftStyles as styles } from './shift-modal-styles';

/** Inline warning banner for validation and server errors inside the shift modals. */
export function ShiftNotice({ message }: { message: string }) {
  return (
    <View style={styles.notice} accessibilityRole="alert">
      <Ionicons
        name="information-circle-outline"
        size={18}
        color={colors.warningText}
        style={styles.noticeIcon}
      />
      <Text style={styles.noticeText}>{message}</Text>
    </View>
  );
}
