import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { LoadingView } from '@/components/LoadingView';
import { hospitalsRepo, LocalHospital } from '@/db/repositories/hospitals.repo';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

export default function HospitalDetailRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [hospital, setHospital] = useState<LocalHospital | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const data = await hospitalsRepo.getById(id);
      setHospital(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <Screen scrollable={false}>
        <LoadingView message="Loading hospital..." />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Hospital Profile" onBack={() => router.back()} />
      <View style={styles.content}>
        <Card>
          <Text style={styles.name}>{hospital?.name || 'Hospital'}</Text>
          <Text style={styles.address}>{hospital?.address}</Text>
          {hospital?.contact_person && (
            <Text style={styles.contact}>Contact: {hospital.contact_person}</Text>
          )}
          {hospital?.contact_phone && (
            <Text style={styles.contact}>Phone: {hospital.contact_phone}</Text>
          )}
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
  },
  name: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  address: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  contact: {
    ...typography.bodyMedium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
});
