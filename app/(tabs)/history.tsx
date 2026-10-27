import React from 'react';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { LoadingView } from '@/components/LoadingView';
import { HistoryList, useHistoryVisits } from '@/features/history';

export default function HistoryRoute() {
  const router = useRouter();
  const { historyVisits, isLoading } = useHistoryVisits();

  return (
    <Screen scrollable={false}>
      <Header title="Visit History & Expenses" />
      {isLoading ? (
        <LoadingView message="Loading past history..." />
      ) : (
        <HistoryList
          visits={historyVisits}
          onSelectVisit={(id) => router.push(`/history/${id}`)}
        />
      )}
    </Screen>
  );
}
