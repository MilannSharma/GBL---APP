import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface DatePickerModalProps {
  visible: boolean;
  selectedDate: string;
  onClose: () => void;
  onSelectDate: (date: string) => void;
}

const PRESET_OPTIONS = [
  { label: 'Today (24 Nov)', value: '24 Nov 2025' },
  { label: 'Tomorrow (25 Nov)', value: '25 Nov 2025' },
  { label: 'Yesterday (23 Nov)', value: '23 Nov 2025' },
  { label: 'All Dates', value: 'All Dates' },
];

const DAYS_HEADER = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Days in November 2025: 1st is Saturday (index 6), total 30 days
const CALENDAR_DAYS: (number | null)[] = [
  null, null, null, null, null, null, 1,
  2, 3, 4, 5, 6, 7, 8,
  9, 10, 11, 12, 13, 14, 15,
  16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29,
  30, null, null, null, null, null, null
];

export function DatePickerModal({
  visible,
  selectedDate,
  onClose,
  onSelectDate,
}: DatePickerModalProps) {
  const [currentMonth, setCurrentMonth] = useState('November 2025');

  // Parse currently active day number if available
  const getSelectedDayNumber = () => {
    const match = selectedDate.match(/(\d{1,2})\s+Nov/i);
    return match ? parseInt(match[1], 10) : (selectedDate.includes('24') ? 24 : null);
  };

  const activeDayNum = getSelectedDayNumber();

  const handlePickDay = (day: number) => {
    const padded = day < 10 ? `0${day}` : `${day}`;
    const dateFormatted = `${padded} Nov 2025`;
    onSelectDate(dateFormatted);
    onClose();
  };

  const handlePickPreset = (val: string) => {
    onSelectDate(val);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheetContainer}>
          <View style={styles.grabber} />

          {/* Modal Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerSubtitle}>Calendar Filter</Text>
              <Text style={styles.headerTitle}>Select Visit Date</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Quick Preset Pills */}
            <Text style={styles.sectionLabel}>Quick Presets</Text>
            <View style={styles.presetGrid}>
              {PRESET_OPTIONS.map((opt) => {
                const isSelected = selectedDate.includes(opt.value) || selectedDate === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.label}
                    style={[styles.presetChip, isSelected && styles.presetChipActive]}
                    onPress={() => handlePickPreset(opt.value)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={13}
                      color={isSelected ? '#FFFFFF' : '#0E70E3'}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.presetText, isSelected && styles.presetTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Monthly Calendar View */}
            <View style={styles.calendarCard}>
              {/* Month Navigation */}
              <View style={styles.monthHeader}>
                <TouchableOpacity style={styles.monthNavButton}>
                  <Ionicons name="chevron-back" size={18} color="#0D2646" />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>{currentMonth}</Text>
                <TouchableOpacity style={styles.monthNavButton}>
                  <Ionicons name="chevron-forward" size={18} color="#0D2646" />
                </TouchableOpacity>
              </View>

              {/* Day of Week Row */}
              <View style={styles.weekRow}>
                {DAYS_HEADER.map((d, i) => (
                  <Text key={i} style={styles.weekDayText}>
                    {d}
                  </Text>
                ))}
              </View>

              {/* Days Grid */}
              <View style={styles.daysGrid}>
                {CALENDAR_DAYS.map((day, idx) => {
                  if (day === null) {
                    return <View key={`empty-${idx}`} style={styles.dayCellEmpty} />;
                  }
                  const isSelected = activeDayNum === day && selectedDate !== 'All Dates';
                  const isToday = day === 24;

                  return (
                    <TouchableOpacity
                      key={`day-${day}`}
                      style={[
                        styles.dayCell,
                        isSelected && styles.dayCellSelected,
                        isToday && !isSelected && styles.dayCellToday,
                      ]}
                      onPress={() => handlePickDay(day)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isSelected && styles.dayTextSelected,
                          isToday && !isSelected && styles.dayTextToday,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(13, 38, 70, 0.45)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  grabber: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D2646',
    letterSpacing: -0.4,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  presetChipActive: {
    backgroundColor: '#0E70E3',
    borderColor: '#0E70E3',
  },
  presetText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0E70E3',
  },
  presetTextActive: {
    color: '#FFFFFF',
  },
  calendarCard: {
    backgroundColor: '#F8FBFE',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthNavButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D2646',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekDayText: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  dayCellEmpty: {
    width: 38,
    height: 38,
    marginVertical: 4,
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: '#0E70E3',
    backgroundColor: '#FFFFFF',
  },
  dayCellSelected: {
    backgroundColor: '#0E70E3',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dayText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0D2646',
  },
  dayTextToday: {
    color: '#0E70E3',
    fontWeight: '700',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
