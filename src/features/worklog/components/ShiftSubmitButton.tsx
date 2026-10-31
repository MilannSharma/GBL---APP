import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/core/theme';
import { shiftStyles as styles } from './shift-modal-styles';

export interface ShiftSubmitButtonProps {
  label: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  isLoading: boolean;
  onPress: () => void;
}

export function ShiftSubmitButton({ label, iconName, isLoading, onPress }: ShiftSubmitButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isLoading, busy: isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        <>
          <Ionicons name={iconName} size={20} color={colors.white} style={styles.submitIcon} />
          <Text style={styles.submitText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
