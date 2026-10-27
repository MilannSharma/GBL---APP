import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

export default function SettingsRoute() {
  const router = useRouter();

  return (
    <Screen>
      <Header title="App Settings" onBack={() => router.back()} />
      <View style={styles.content}>
        <Card>
          <Text style={styles.itemTitle}>Language</Text>
          <Text style={styles.itemValue}>English</Text>
        </Card>
        <Card>
          <Text style={styles.itemTitle}>Offline Sync</Text>
          <Text style={styles.itemValue}>Automatic (Every 60s)</Text>
        </Card>
        <Card>
          <Text style={styles.itemTitle}>App Version</Text>
          <Text style={styles.itemValue}>v1.0.0 (Build 1)</Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
  },
  itemTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  itemValue: {
    ...typography.body,
    color: colors.textMuted,
  },
});
