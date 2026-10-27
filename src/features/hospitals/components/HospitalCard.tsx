import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/Card';
import { LocalHospital } from '@/db/repositories/hospitals.repo';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

export interface HospitalCardProps {
  hospital: LocalHospital;
  onPress: () => void;
}

export function HospitalCard({ hospital, onPress }: HospitalCardProps) {
  return (
    <Card onPress={onPress}>
      <Text style={styles.name}>{hospital.name}</Text>
      <Text style={styles.address}>{hospital.address}</Text>
      {hospital.contact_phone && (
        <View style={styles.phoneContainer}>
          <Text style={styles.phoneLabel}>Phone: </Text>
          <Text style={styles.phone}>{hospital.contact_phone}</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  name: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  address: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneLabel: {
    ...typography.captionMedium,
    color: colors.textMuted,
  },
  phone: {
    ...typography.captionMedium,
    color: colors.primary,
  },
});
