import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MUMBAI_HOSPITAL_PRESETS } from '../api';
import { HospitalVisit } from '../types';

export interface CreateVisitModalProps {
  visible: boolean;
  onClose: () => void;
  onAddVisit: (visit: Omit<HospitalVisit, 'id'>) => Promise<void> | void;
  defaultDate?: string;
}

const COMMON_TIMES = [
  '09:30 AM',
  '11:15 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM',
  '07:00 PM',
];

export function CreateVisitModal({
  visible,
  onClose,
  onAddVisit,
  defaultDate = '24 Nov 2025',
}: CreateVisitModalProps) {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(0);
  const [hospitalName, setHospitalName] = useState(MUMBAI_HOSPITAL_PRESETS[0].name);
  const [address, setAddress] = useState(MUMBAI_HOSPITAL_PRESETS[0].address);
  const [selectedTime, setSelectedTime] = useState(COMMON_TIMES[0]);
  const [doctorName, setDoctorName] = useState(MUMBAI_HOSPITAL_PRESETS[0].doctorName);
  const [department, setDepartment] = useState(MUMBAI_HOSPITAL_PRESETS[0].department);
  const [notes, setNotes] = useState('');

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    const preset = MUMBAI_HOSPITAL_PRESETS[index];
    setHospitalName(preset.name);
    setAddress(preset.address);
    setDoctorName(preset.doctorName);
    setDepartment(preset.department);
  };

  const handleCreate = async () => {
    if (!hospitalName.trim() || !address.trim()) return;

    await onAddVisit({
      hospitalName: hospitalName.trim(),
      address: address.trim(),
      city: 'Mumbai',
      state: 'Maharashtra',
      time: selectedTime,
      date: defaultDate,
      isoDate: '2025-11-24',
      status: 'not_visited',
      doctorName: doctorName.trim() || 'Medical Officer',
      department: department.trim() || 'General OPD',
      notes: notes.trim() || 'Routine hospital visit and stock coordination.',
    });

    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
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
              <Text style={styles.headerSubtitle}>New Schedule</Text>
              <Text style={styles.headerTitle}>Add Hospital Visit</Text>
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
            {/* Quick Presets Selection */}
            <Text style={styles.inputLabel}>Quick Select Location</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
              {MUMBAI_HOSPITAL_PRESETS.map((preset, idx) => {
                const isSelected = selectedPresetIndex === idx;
                return (
                  <TouchableOpacity
                    key={preset.name}
                    style={[styles.presetChip, isSelected && styles.presetChipSelected]}
                    onPress={() => handleSelectPreset(idx)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="business-outline"
                      size={14}
                      color={isSelected ? '#0E70E3' : '#64748B'}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.presetText, isSelected && styles.presetTextSelected]} numberOfLines={1}>
                      {preset.name.split(',')[0]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Hospital Name Input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Hospital Name *</Text>
              <TextInput
                style={styles.textInput}
                value={hospitalName}
                onChangeText={(val) => {
                  setHospitalName(val);
                  setSelectedPresetIndex(null);
                }}
                placeholder="e.g. City Care Hospital"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Address Input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Location / Address *</Text>
              <TextInput
                style={styles.textInput}
                value={address}
                onChangeText={setAddress}
                placeholder="e.g. Bandra West, Mumbai"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Scheduled Time Pills */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Scheduled Time</Text>
              <View style={styles.timeGrid}>
                {COMMON_TIMES.map((timeStr) => {
                  const isSelected = selectedTime === timeStr;
                  return (
                    <TouchableOpacity
                      key={timeStr}
                      style={[styles.timeChip, isSelected && styles.timeChipSelected]}
                      onPress={() => setSelectedTime(timeStr)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.timeChipText, isSelected && styles.timeChipTextSelected]}>
                        {timeStr}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Doctor and Department */}
            <View style={styles.rowTwoCols}>
              <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Doctor / Rep</Text>
                <TextInput
                  style={styles.textInput}
                  value={doctorName}
                  onChangeText={setDoctorName}
                  placeholder="Dr. Name"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Department</Text>
                <TextInput
                  style={styles.textInput}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder="e.g. Cardiology"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Notes */}
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Purpose / Objectives</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                placeholder="Special notes or drug batch check..."
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Create Button */}
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreate}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.createButtonText}>Add to Today's Visits</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    maxHeight: '90%',
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
    paddingBottom: 24,
  },
  presetScroll: {
    marginBottom: 14,
    marginTop: 6,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginRight: 8,
  },
  presetChipSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0E70E3',
  },
  presetText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  presetTextSelected: {
    color: '#0E70E3',
    fontWeight: '700',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  textInput: {
    backgroundColor: '#F8FBFE',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0D2646',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  rowTwoCols: {
    flexDirection: 'row',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  timeChipSelected: {
    backgroundColor: '#0E70E3',
    borderColor: '#0E70E3',
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  timeChipTextSelected: {
    color: '#FFFFFF',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E70E3',
    paddingVertical: 15,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
