import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

export default function ReviewRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen>
      <Header title="Review & Complete" onBack={() => router.back()} />
      <View style={styles.content}>
        <Text style={styles.title}>Visit Summary</Text>
        <Card style={styles.card}>
          <Text style={styles.label}>GPS Verification: Checked In</Text>
          <Text style={styles.label}>Form Details: Completed</Text>
          <Text style={styles.label}>Photos: Attached</Text>
          <Text style={styles.label}>Signature: Captured</Text>
        </Card>

        <Button
          title="Submit Visit"
          onPress={() => router.replace(`/visit/${id}/done`)}
          style={styles.submitButton}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});
