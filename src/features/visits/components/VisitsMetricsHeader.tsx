import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DatePickerModal } from './DatePickerModal';

export interface VisitsMetricsHeaderProps {
  visitedCount: number;
  notVisitedCount: number;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  isDayStarted: boolean;
  dayStartTime?: string;
  onDayStatusPress: () => void;
  statusFilter: 'all' | 'visited' | 'not_visited';
  onSelectStatusFilter: (filter: 'all' | 'visited' | 'not_visited') => void;
  sortBy: 'time' | 'name' | 'status';
  onSelectSortBy: (sort: 'time' | 'name' | 'status') => void;
}

const FILTER_STATUS_OPTIONS: { key: 'all' | 'visited' | 'not_visited'; label: string; icon: any }[] = [
  { key: 'all', label: 'All Visits', icon: 'apps-outline' },
  { key: 'visited', label: 'Visited Only', icon: 'checkmark-circle-outline' },
  { key: 'not_visited', label: 'Not Yet Visited Only', icon: 'time-outline' },
];

const SORT_OPTIONS: { key: 'time' | 'name' | 'status'; label: string }[] = [
  { key: 'time', label: 'Scheduled Time (Earliest First)' },
  { key: 'name', label: 'Hospital Name (A-Z)' },
];

export function VisitsMetricsHeader({
  visitedCount,
  notVisitedCount,
  selectedDate,
  onSelectDate,
  isDayStarted,
  dayStartTime,
  onDayStatusPress,
  statusFilter,
  onSelectStatusFilter,
  sortBy,
  onSelectSortBy,
}: VisitsMetricsHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const topPadding = Platform.OS === 'android' ? Math.max(insets.top, StatusBar.currentHeight || 0) + 8 : insets.top + 6;

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#0D2646" />
        </TouchableOpacity>

        <View style={styles.titleColumn}>
          <Text style={styles.titleText}>Visits</Text>
          <Text style={styles.subtitleText}>
            Track your hospital visits and manage your field activities.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.bellButton}
          onPress={() => router.push('/notifications')}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          activeOpacity={0.8}
        >
          <Ionicons name="notifications-outline" size={22} color="#0D2646" />
          <View style={styles.unreadBadgeDot} />
        </TouchableOpacity>
      </View>

      {/* Date & Day Status Row */}
      <View style={styles.filterRow}>
        {/* Date Dropdown Pill */}
        <TouchableOpacity
          style={styles.datePill}
          onPress={() => setDateModalVisible(true)}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel={`Selected date ${selectedDate}`}
        >
          <Ionicons name="calendar-outline" size={15} color="#0D2646" style={styles.pillIcon} />
          <Text style={styles.datePillText} numberOfLines={1}>
            {selectedDate.startsWith('Today') || selectedDate === 'All Dates' ? selectedDate : `Today, ${selectedDate}`}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#0D2646" style={styles.chevronIcon} />
        </TouchableOpacity>

        {/* Day Status Pill */}
        <TouchableOpacity
          style={[styles.dayStatusPill, isDayStarted && styles.dayStatusStarted]}
          onPress={onDayStatusPress}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Day status"
        >
          <Ionicons
            name={isDayStarted ? 'checkmark-circle' : 'calendar-outline'}
            size={14}
            color={isDayStarted ? '#10B981' : '#0E70E3'}
            style={styles.pillIcon}
          />
          <Text style={[styles.dayStatusText, isDayStarted && styles.dayStatusTextStarted]} numberOfLines={1}>
            {isDayStarted ? (dayStartTime ? `Day started (${dayStartTime})` : 'Day in progress') : 'Day not started'}
          </Text>
          <Ionicons
            name="information-circle-outline"
            size={14}
            color={isDayStarted ? '#10B981' : '#0E70E3'}
            style={styles.infoIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Metrics Row (2 Cards) */}
      <View style={styles.metricsRow}>
        {/* Visited Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricIconCircleBlue}>
            <Ionicons name="location" size={18} color="#0E70E3" />
          </View>
          <View style={styles.metricTextWrapper}>
            <Text style={styles.metricNumber}>{visitedCount}</Text>
            <Text style={[styles.metricLabel, styles.metricLabelBlue]}>Visited</Text>
          </View>
        </View>

        {/* Not Yet Visited Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricIconCirclePurple}>
            <Ionicons name="time-outline" size={18} color="#6366F1" />
          </View>
          <View style={styles.metricTextWrapper}>
            <Text style={styles.metricNumber}>{notVisitedCount}</Text>
            <Text style={styles.metricLabel}>Not Yet Visited</Text>
          </View>
        </View>
      </View>

      {/* Section Header: Hospital Visits + Sort / Filter */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Hospital Visits</Text>
          {statusFilter !== 'all' && (
            <View style={styles.activeFilterPill}>
              <Text style={styles.activeFilterPillText}>
                {statusFilter === 'visited' ? 'Visited' : 'Not Visited'}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.sortButton, statusFilter !== 'all' && styles.sortButtonActive]}
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Filter and Sort hospital visits"
        >
          <Ionicons
            name="filter"
            size={14}
            color={statusFilter !== 'all' ? '#0E70E3' : '#0D2646'}
            style={styles.sortIcon}
          />
          <Text style={[styles.sortText, statusFilter !== 'all' && styles.sortTextActive]}>
            {statusFilter !== 'all' ? 'Filtered' : 'Filter / Sort'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Interactive Date Picker Modal */}
      <DatePickerModal
        visible={dateModalVisible}
        selectedDate={selectedDate}
        onClose={() => setDateModalVisible(false)}
        onSelectDate={onSelectDate}
      />

      {/* Filter & Sort Bottom Sheet Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.grabber} />
            <Text style={styles.modalTitle}>Filter & Sort Visits</Text>

            {/* Filter by Status */}
            <Text style={styles.groupLabel}>Filter by Visit Status</Text>
            {FILTER_STATUS_OPTIONS.map((opt) => {
              const isSelected = statusFilter === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                  onPress={() => onSelectStatusFilter(opt.key)}
                >
                  <Ionicons
                    name={opt.icon}
                    size={18}
                    color={isSelected ? '#0E70E3' : '#64748B'}
                    style={styles.modalItemIcon}
                  />
                  <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                    {opt.label}
                  </Text>
                  {isSelected && <Ionicons name="checkmark-circle" size={18} color="#0E70E3" />}
                </TouchableOpacity>
              );
            })}

            <View style={styles.modalDivider} />

            {/* Sort by */}
            <Text style={styles.groupLabel}>Sort Order</Text>
            {SORT_OPTIONS.map((opt) => {
              const isSelected = sortBy === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                  onPress={() => onSelectSortBy(opt.key)}
                >
                  <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                    {opt.label}
                  </Text>
                  {isSelected && <Ionicons name="checkmark-circle" size={18} color="#0E70E3" />}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setFilterModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonText}>Apply Changes</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#F8FBFE',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  titleColumn: {
    flex: 1,
    paddingRight: 8,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0D2646',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  unreadBadgeDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  datePill: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  datePillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0D2646',
    flex: 1,
  },
  pillIcon: {
    marginRight: 6,
  },
  chevronIcon: {
    marginLeft: 4,
  },
  dayStatusPill: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  dayStatusStarted: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  dayStatusText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0E70E3',
    flex: 1,
  },
  dayStatusTextStarted: {
    color: '#10B981',
  },
  infoIcon: {
    marginLeft: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  metricIconCircleBlue: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  metricIconCirclePurple: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  metricTextWrapper: {
    justifyContent: 'center',
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D2646',
    lineHeight: 24,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  metricLabelBlue: {
    color: '#0E70E3',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0D2646',
    letterSpacing: -0.3,
  },
  activeFilterPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  activeFilterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0E70E3',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sortButtonActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  sortIcon: {
    marginRight: 5,
  },
  sortText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0D2646',
  },
  sortTextActive: {
    color: '#0E70E3',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 38, 70, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  grabber: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0D2646',
    marginBottom: 16,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
    marginTop: 4,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  modalItemSelected: {
    backgroundColor: '#EFF6FF',
  },
  modalItemIcon: {
    marginRight: 10,
  },
  modalItemText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  modalItemTextSelected: {
    color: '#0E70E3',
    fontWeight: '700',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#EDF2F7',
    marginVertical: 12,
  },
  applyButton: {
    backgroundColor: '#0E70E3',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 14,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
