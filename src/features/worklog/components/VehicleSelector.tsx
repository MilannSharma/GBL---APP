import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '@/core/theme';
import { t } from '@/core/i18n';
import { shiftStyles, MIN_TOUCH_SIZE } from './shift-modal-styles';
import type { VehicleType } from '../types';

const OPTIONS: ReadonlyArray<{
  value: VehicleType;
  labelKey: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}> = [
  { value: 'BIKE', labelKey: 'worklog.vehicleBike', icon: 'bicycle' },
  { value: 'CAR', labelKey: 'worklog.vehicleCar', icon: 'car-outline' },
];

export interface VehicleSelectorProps {
  value: VehicleType;
  onChange: (value: VehicleType) => void;
}

export function VehicleSelector({ value, onChange }: VehicleSelectorProps) {
  return (
    <View style={shiftStyles.group}>
      <Text style={shiftStyles.label}>{t('worklog.vehicleLabel')}</Text>
      <View style={styles.row}>
        {OPTIONS.map((option) => {
          const isSelected = option.value === value;
          const label = t(option.labelKey);
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.button, isSelected && styles.buttonSelected]}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityLabel={label}
              accessibilityState={{ selected: isSelected }}
            >
              <Ionicons
                name={option.icon}
                size={20}
                color={isSelected ? colors.primary : colors.textMuted}
              />
              <Text style={[styles.text, isSelected && styles.textSelected]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MIN_TOUCH_SIZE + 2,
    borderRadius: radii.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    gap: spacing.sm,
  },
  buttonSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  text: { ...typography.captionMedium, color: colors.textMuted },
  textSelected: { color: colors.primary },
});
