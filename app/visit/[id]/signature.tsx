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

export default function SignatureRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen>
      <Header title="Doctor Signature" onBack={() => router.back()} />
      <View style={styles.content}>
        <Text style={styles.subtitle}>Please ask the doctor to sign below to verify the visit.</Text>
        <Card style={styles.canvasPlaceholder}>
          <Text style={styles.canvasText}>[Digital Signature Canvas Area]</Text>
        </Card>
        <Button
          title="Review Visit"
          onPress={() => router.push(`/visit/${id}/review`)}
          style={styles.button}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  canvasPlaceholder: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  canvasText: {
    ...typography.captionMedium,
    color: colors.textMuted,
  },
  button: {
    marginTop: spacing.xl,
  },
});
