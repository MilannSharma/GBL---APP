import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { spacing, radii } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

export type BadgeVariant = 'info' | 'warning' | 'success' | 'danger' | 'muted';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export function Badge({ label, variant = 'info' }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant]]}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.chip,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.captionMedium,
  },
  info: {
    backgroundColor: '#EEF2FF',
  },
  infoText: {
    color: colors.info,
  },
  warning: {
    backgroundColor: '#FEF3C7',
  },
  warningText: {
    color: colors.warning,
  },
  success: {
    backgroundColor: '#ECFDF5',
  },
  successText: {
    color: colors.success,
  },
  danger: {
    backgroundColor: '#FEE2E2',
  },
  dangerText: {
    color: colors.danger,
  },
  muted: {
    backgroundColor: '#F1F5F9',
  },
  mutedText: {
    color: colors.textMuted,
  },
});
