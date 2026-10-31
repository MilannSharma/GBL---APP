import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/core/theme';
import { MIN_TOUCH_SIZE } from './shift-modal-styles';
import type { ShiftLocationStatus } from '../hooks/useShiftLocation';

export interface ShiftLocationBadgeProps {
  status: ShiftLocationStatus;
  label: string;
  onRetry: () => void;
}

/** GPS pre-flight indicator. Tapping retries when the last attempt failed. */
export function ShiftLocationBadge({ status, label, onRetry }: ShiftLocationBadgeProps) {
  const isReady = status === 'ready';
  const isLocating = status === 'locating';

  return (
    <TouchableOpacity
      style={styles.badge}
      onPress={onRetry}
      disabled={isReady || isLocating}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ busy: isLocating }}
    >
      {isLocating ? (
        <ActivityIndicator size="small" color={colors.warning} style={styles.icon} />
      ) : (
        <Ionicons
          name={isReady ? 'location' : 'navigate-outline'}
          size={16}
          color={isReady ? colors.success : colors.warning}
          style={styles.icon}
        />
      )}
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MIN_TOUCH_SIZE,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    borderRadius: radii.card,
    marginBottom: spacing.md,
  },
  icon: { marginRight: spacing.sm },
  text: { flex: 1, ...typography.caption, color: colors.textMuted },
});
