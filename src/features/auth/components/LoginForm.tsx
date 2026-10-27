import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { colors } from '@/core/theme/colors';

export interface LoginFormProps {
  onSubmitPhone: (phone: string) => void;
  loading?: boolean;
  error?: string | null;
}

export function LoginForm({ onSubmitPhone, loading, error }: LoginFormProps) {
  const [phone, setPhone] = useState('');
  const [validationError, setValidationError] = useState('');

  const handlePress = () => {
    if (phone.trim().length < 10) {
      setValidationError('Please enter a valid 10-digit phone number');
      return;
    }
    setValidationError('');
    onSubmitPhone(phone.trim());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agent Login</Text>
      <Text style={styles.subtitle}>Enter your registered phone number to receive an OTP</Text>
      <Input
        label="Phone Number"
        placeholder="e.g. 9876543210"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        error={validationError || (error ?? undefined)}
        maxLength={15}
      />
      <Button
        title="Get OTP"
        onPress={handlePress}
        loading={loading}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  button: {
    marginTop: spacing.md,
  },
});
