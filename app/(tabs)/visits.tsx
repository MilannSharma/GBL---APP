import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  HospitalVisitCard,
  VisitsMetricsHeader,
  VisitsSearchInput,
  VisitsSearchResults,
  CreateVisitModal,
  StartDayGuardModal,
  useHospitalVisits,
  useVisitShiftGate,
  HospitalEntity,
  HospitalVisit,
  hospitalHref,
  hospitalOfVisit,
} from '@/features/visits';
import { StartWorkShiftModal } from '@/features/worklog';
import { t } from '@/core/i18n';

export default function VisitsRoute() {
  const router = useRouter();
  const { visits, visitedCount, totalCount, isLoading, isError, refetch } = useHospitalVisits();
  const { isDayStarted, isDayEnded, startShift, isStarting, startError, clearStartError } = useVisitShiftGate();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [showEndedModal, setShowEndedModal] = useState(false);
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [prefillName, setPrefillName] = useState('');
  const isSearching = searchTerm.trim().length > 0;

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSelectEntity = (entity: HospitalEntity) => {
    router.push(hospitalHref(entity));
  };

  const handleOpenVisit = (visit: HospitalVisit) => {
    const hospital = hospitalOfVisit(visit);
    if (hospital) router.push(hospitalHref(hospital));
  };

  // An active shift is required to record visits: without one, the start-day form opens right here.
  const handleCreateVisitPress = (name = '') => {
    if (isDayEnded) {
      setShowEndedModal(true);
      return;
    }
    if (!isDayStarted) {
      clearStartError();
      setStartModalVisible(true);
      return;
    }
    setPrefillName(name);
    setCreateModalVisible(true);
  };

  const handleVisitSaved = ({ hasSelfie }: { hasSelfie: boolean }) => {
    setSearchTerm('');
    if (!hasSelfie) {
      Alert.alert(t('visits.add.title'), t('visits.add.selfieMissingNotice'));
    }
  };

  return (
    <View style={styles.screenContainer}>
      {/* Hospital Visits List */}
      <FlatList
        data={isSearching ? [] : visits}
        keyboardShouldPersistTaps="handled"
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
          <View>
            <VisitsMetricsHeader
              visitedCount={visitedCount}
              totalVisits={totalCount}
            />
            <VisitsSearchInput value={searchTerm} onChange={setSearchTerm} />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardPadding}>
            <HospitalVisitCard
              visit={item}
              onPress={() => handleOpenVisit(item)}
            />
          </View>
        )}
        ListEmptyComponent={
          isSearching ? (
            <VisitsSearchResults
              term={searchTerm}
              onSelectEntity={handleSelectEntity}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="business-outline" size={38} color="#94A3B8" />
              </View>
              {isError ? (
                <Text style={styles.emptySubtitle}>{t('visits.list.error')}</Text>
              ) : (
                <>
                  <Text style={styles.emptyTitle}>{t('visits.list.emptyTitle')}</Text>
                  <Text style={styles.emptySubtitle}>{t('visits.list.emptyBody')}</Text>
                </>
              )}
            </View>
          )
        }
      />

      {/* Floating Action Button: + Add Visit */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => handleCreateVisitPress(searchTerm.trim())}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Add Visit"
      >
        <Ionicons name="add" size={20} color="#FFFFFF" style={styles.fabIcon} />
        <Text style={styles.fabText}>Add Visit</Text>
      </TouchableOpacity>

      {/* Day already ended: a shift runs once per day */}
      <StartDayGuardModal
        visible={showEndedModal}
        isDayEnded
        onClose={() => setShowEndedModal(false)}
      />

      {/* Day not started: start it here, then Add Visit is available */}
      <StartWorkShiftModal
        visible={startModalVisible}
        onClose={() => setStartModalVisible(false)}
        onSubmit={startShift}
        loading={isStarting}
        serverError={startError}
        subtitle={t('visits.add.startDayFirst')}
      />

      {/* Add Hospital Visit */}
      <CreateVisitModal
        visible={createModalVisible}
        initialName={prefillName}
        onClose={() => setCreateModalVisible(false)}
        onSaved={handleVisitSaved}
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
});
