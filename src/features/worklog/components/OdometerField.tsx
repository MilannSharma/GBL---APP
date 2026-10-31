import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/core/theme';
import { t } from '@/core/i18n';
import { shiftStyles as styles } from './shift-modal-styles';

export interface OdometerFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}

export function OdometerField({ label, value, onChangeText }: OdometerFieldProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Feather name="activity" size={18} color={colors.textMuted} style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder={t('worklog.readingPlaceholder')}
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          value={value}
          onChangeText={onChangeText}
          accessibilityLabel={label}
        />
        <Text style={styles.unitText}>KM</Text>
      </View>
    </View>
  );
}
