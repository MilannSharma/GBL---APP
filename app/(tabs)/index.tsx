import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { LoadingView } from '@/components/LoadingView';
import { EmptyState } from '@/components/EmptyState';
import { VisitCard, useTodayVisits } from '@/features/visits';
import { spacing } from '@/core/theme/spacing';

export default function HomeRoute() {
  const router = useRouter();
  const { visits, isLoading, refetch } = useTodayVisits();

  return (
    <Screen scrollable={false}>
      <Header title="Today's Schedule" />
      {isLoading ? (
        <LoadingView message="Loading your schedule..." />
      ) : visits.length === 0 ? (
        <EmptyState
          title="No Visits Today"
          description="You have no assigned visits scheduled for today."
          actionTitle="Refresh"
          onAction={refetch}
        />
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
