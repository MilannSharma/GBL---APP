import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  HospitalVisitCard,
  VisitsMetricsHeader,
  VisitActionModal,
  CreateVisitModal,
  useHospitalVisits,
  HospitalVisit,
} from '@/features/visits';

export default function VisitsRoute() {
  const router = useRouter();
  const {
    visits,
    visitedCount,
    notVisitedCount,
    selectedDate,
    setSelectedDate,
    sortBy,
    setSortBy,
    isDayStarted,
    setIsDayStarted,
    isLoading,
    refetch,
    addVisit,
    updateVisit,
    toggleStatus,
  } = useHospitalVisits();

  const [activeVisit, setActiveVisit] = useState<HospitalVisit | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleStartCheckIn = (visitId: string) => {
    setActiveVisit(null);
    router.push(`/visit/${visitId}/check-in`);
  };

  return (
    <View style={styles.screenContainer}>
      {/* Hospital Visits List */}
      <FlatList
        data={visits}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading || refreshing}
            onRefresh={handleRefresh}
            tintColor="#0E70E3"
            colors={['#0E70E3']}
          />
        }
        ListHeaderComponent={
          <VisitsMetricsHeader
            visitedCount={visitedCount}
            notVisitedCount={notVisitedCount}
            selectedDate={selectedDate}
            onSelectDate={(date) => setSelectedDate(date)}
            isDayStarted={isDayStarted}
            onToggleDayStarted={() => setIsDayStarted(!isDayStarted)}
            sortBy={sortBy}
            onSelectSortBy={(sort) => setSortBy(sort)}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.cardPadding}>
            <HospitalVisitCard
              visit={item}
              onPress={() => setActiveVisit(item)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="calendar-outline" size={38} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>No Visits Scheduled</Text>
            <Text style={styles.emptySubtitle}>
              There are no hospital visits for {selectedDate}. Tap below to schedule a new visit.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setCreateModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.emptyButtonText}>Create New Visit</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Floating Action Button: + Create Visit */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => setCreateModalVisible(true)}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Create Visit"
      >
        <Ionicons name="add" size={20} color="#FFFFFF" style={styles.fabIcon} />
        <Text style={styles.fabText}>Create Visit</Text>
      </TouchableOpacity>

      {/* Interactive Visit Action & Details Modal */}
      <VisitActionModal
        visible={!!activeVisit}
        visit={activeVisit}
        onClose={() => setActiveVisit(null)}
        onToggleStatus={async (id) => {
          await toggleStatus(id);
          setActiveVisit(null);
        }}
        onUpdateVisit={async (id, updates) => {
          await updateVisit({ id, updates });
          if (activeVisit && activeVisit.id === id) {
            setActiveVisit({ ...activeVisit, ...updates });
          }
        }}
        onStartCheckIn={handleStartCheckIn}
      />

      {/* Create New Hospital Visit Modal */}
      <CreateVisitModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onAddVisit={async (newVisit) => {
          await addVisit(newVisit);
        }}
        defaultDate={selectedDate.includes(',') ? selectedDate.split(',')[1].trim() : selectedDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8FBFE',
  },
  listContent: {
    paddingBottom: 150, // Extra space so last item stays above floating FAB & bottom dock
  },
  cardPadding: {
    paddingHorizontal: 20,
  },
  fabButton: {
    position: 'absolute',
    bottom: 96,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E70E3',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 26,
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  fabIcon: {
    marginRight: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EDF2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0D2646',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E70E3',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
  },
});
