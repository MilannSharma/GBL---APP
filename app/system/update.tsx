import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

export default function SystemUpdateRoute() {
  return (
    <Screen scrollable={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Update Required</Text>
        <Text style={styles.description}>
          A mandatory version of the Field Agent app is available. Please update to proceed.
        </Text>
        <Button
          title="Download Update"
          onPress={() => {}}
          style={styles.button}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    minWidth: 200,
  },
});
