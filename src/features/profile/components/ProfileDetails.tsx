import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { AgentProfile } from '@/types';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

export interface ProfileDetailsProps {
  profile: AgentProfile;
  onLogout: () => void;
}

export function ProfileDetails({ profile, onLogout }: ProfileDetailsProps) {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.phone}>{profile.phone}</Text>
        {profile.email && <Text style={styles.email}>{profile.email}</Text>}
      </Card>

      <Button
        title="Logout"
        variant="danger"
        onPress={onLogout}
        style={styles.logoutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  card: {
    marginBottom: spacing.lg,
  },
  name: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  phone: {
    ...typography.body,
    color: colors.textMuted,
  },
  email: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  logoutButton: {
    marginTop: spacing.md,
  },
});
