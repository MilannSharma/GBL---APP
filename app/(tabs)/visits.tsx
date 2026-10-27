import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { VisitCard, useTodayVisits } from '@/features/visits';
import { EmptyState } from '@/components/EmptyState';
import { spacing } from '@/core/theme/spacing';

export default function VisitsRoute() {
  const router = useRouter();
  const { visits, isLoading, refetch } = useTodayVisits();

  return (
    <Screen scrollable={false}>
      <Header title="All Scheduled Visits" />
      {visits.length === 0 ? (
        <EmptyState title="No Scheduled Visits" description="All visits list is currently clear." />
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VisitCard
              visit={item}
              onPress={() => router.push(`/visit/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.screenPadding,
  },
});
