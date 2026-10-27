import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { useAuth } from '@/features/auth';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { colors } from '@/core/theme/colors';

export default function OtpRoute() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { loginWithOtp, loading, error } = useAuth();
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    if (otp.trim().length !== 6 || !phone) return;
    const ok = await loginWithOtp(phone, otp.trim());
    if (ok) {
      router.replace('/(tabs)');
    }
  };

  return (
    <Screen scrollable={false}>
      <Header title="Verify OTP" onBack={() => router.back()} />
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Enter the 6-digit OTP sent to {phone || 'your phone number'}
        </Text>
        <Input
          label="Verification Code"
          placeholder="123456"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          error={error ?? undefined}
        />
        <Button
          title="Verify & Enter"
          onPress={handleVerify}
          loading={loading}
          style={styles.button}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.screenPadding,
    flex: 1,
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
