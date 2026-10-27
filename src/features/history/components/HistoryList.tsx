import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { LocalVisit } from '@/db/repositories/visits.repo';
import { VisitCard } from '@/features/visits';
import { EmptyState } from '@/components/EmptyState';
import { spacing } from '@/core/theme/spacing';

export interface HistoryListProps {
  visits: LocalVisit[];
  onSelectVisit: (id: string) => void;
}

export function HistoryList({ visits, onSelectVisit }: HistoryListProps) {
  if (visits.length === 0) {
    return <EmptyState title="No Past Visits" description="Your completed visits will appear here." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={visits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VisitCard visit={item} onPress={() => onSelectVisit(item.id)} />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingVertical: spacing.md,
  },
});
