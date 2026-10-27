import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/Button';
import { useCheckIn } from '../hooks/useCheckIn';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { colors } from '@/core/theme/colors';

export interface CheckInActionProps {
  visitId: string;
  onSuccess: () => void;
}

export function CheckInAction({ visitId, onSuccess }: CheckInActionProps) {
  const { checkIn, loading, error } = useCheckIn(visitId);

  const handleCheckIn = async () => {
    const success = await checkIn();
    if (success) {
      onSuccess();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Arrival</Text>
      <Text style={styles.description}>
        Your GPS coordinates will be verified against the hospital location.
      </Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button
        title="Check In Now"
        onPress={handleCheckIn}
        loading={loading}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  button: {
    width: '100%',
  },
});
