import React, { useState, useEffect } from 'react';
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
import { HospitalVisit } from '../types';

export interface VisitActionModalProps {
  visible: boolean;
  visit: HospitalVisit | null;
  onClose: () => void;
  onToggleStatus: (id: string) => Promise<void> | void;
  onUpdateVisit: (id: string, updates: Partial<HospitalVisit>) => Promise<void> | void;
  onStartCheckIn?: (visitId: string) => void;
}

export function VisitActionModal({
  visible,
  visit,
  onClose,
  onToggleStatus,
  onUpdateVisit,
  onStartCheckIn,
}: VisitActionModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTime, setEditTime] = useState('');
  const [editDoctor, setEditDoctor] = useState('');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    if (visit) {
      setEditTime(visit.time || '');
      setEditDoctor(visit.doctorName || '');
      setEditNotes(visit.notes || '');
      setIsEditing(false);
    }
  }, [visit]);

  if (!visit) return null;

  const isVisited = visit.status === 'visited';

  const handleSaveEdit = async () => {
    if (!visit) return;
    await onUpdateVisit(visit.id, {
      time: editTime,
      doctorName: editDoctor,
      notes: editNotes,
    });
    setIsEditing(false);
  };

  const handleToggle = async () => {
    if (!visit) return;
    await onToggleStatus(visit.id);
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
          {/* Top Grabber */}
          <View style={styles.grabber} />

          {/* Modal Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerSubtitle}>
                {isVisited ? 'Completed Hospital Visit' : 'Pending Hospital Visit'}
              </Text>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {visit.hospitalName}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Status Pill & Location Tag */}
            <View style={styles.tagsRow}>
              <View style={[styles.statusBadge, isVisited ? styles.badgeVisited : styles.badgeNotVisited]}>
                <Ionicons
                  name={isVisited ? 'checkmark-circle' : 'time-outline'}
                  size={14}
                  color={isVisited ? '#10B981' : '#0E70E3'}
                  style={styles.tagIcon}
                />
                <Text style={[styles.statusText, isVisited ? styles.textVisited : styles.textNotVisited]}>
                  {isVisited ? 'Visited (Verified)' : 'Not Yet Visited'}
                </Text>
              </View>

              <View style={styles.locationTag}>
                <Ionicons name="location-outline" size={13} color="#64748B" style={styles.tagIcon} />
                <Text style={styles.locationTagText} numberOfLines={1}>
                  {visit.city || 'Mumbai'}
                </Text>
              </View>
            </View>

            {/* Visit Details Section */}
            <View style={styles.sectionBox}>
              <View style={styles.detailRow}>
                <Ionicons name="map-outline" size={16} color="#0E70E3" style={styles.sectionIcon} />
                <View style={styles.detailTextWrapper}>
                  <Text style={styles.detailLabel}>Hospital Address</Text>
                  <Text style={styles.detailValue}>{visit.address}</Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={16} color="#0E70E3" style={styles.sectionIcon} />
                <View style={styles.detailTextWrapper}>
                  <Text style={styles.detailLabel}>Scheduled Date & Time</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={editTime}
                      onChangeText={setEditTime}
                      placeholder="e.g. 10:00 AM"
                    />
                  ) : (
                    <Text style={styles.detailValue}>{visit.time} • {visit.date}</Text>
                  )}
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={16} color="#0E70E3" style={styles.sectionIcon} />
                <View style={styles.detailTextWrapper}>
                  <Text style={styles.detailLabel}>Consultant / Department</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.input}
                      value={editDoctor}
                      onChangeText={setEditDoctor}
                      placeholder="Doctor Name & Dept"
                    />
                  ) : (
                    <Text style={styles.detailValue}>
                      {visit.doctorName || 'Hospital Representative'} ({visit.department || 'General'})
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.detailRow}>
                <Ionicons name="document-text-outline" size={16} color="#0E70E3" style={styles.sectionIcon} />
                <View style={styles.detailTextWrapper}>
                  <Text style={styles.detailLabel}>Visit Notes & Objectives</Text>
                  {isEditing ? (
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={editNotes}
                      onChangeText={setEditNotes}
                      multiline
                      numberOfLines={3}
                      placeholder="Add visit notes..."
                    />
                  ) : (
                    <Text style={styles.detailValue}>
                      {visit.notes || 'No specific notes recorded for this visit.'}
                    </Text>
                  )}
                </View>
              </View>

              {/* Visited Check-in Timestamp info */}
              {isVisited && (
                <>
                  <View style={styles.separator} />
                  <View style={styles.detailRow}>
                    <Ionicons name="checkmark-done-circle-outline" size={16} color="#10B981" style={styles.sectionIcon} />
                    <View style={styles.detailTextWrapper}>
                      <Text style={styles.detailLabel}>Check-in Verification</Text>
                      <Text style={[styles.detailValue, { color: '#10B981', fontWeight: '600' }]}>
                        Checked In at {visit.checkInTime || visit.time} • GPS Matched
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>

            {/* Actions for Visited vs Not Visited */}
            {isEditing ? (
              <View style={styles.actionButtonGroup}>
                <TouchableOpacity
                  style={[styles.primaryButton, styles.saveButton]}
                  onPress={handleSaveEdit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => setIsEditing(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : isVisited ? (
              <View style={styles.actionButtonGroup}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleToggle}
                  activeOpacity={0.8}
                >
                  <Ionicons name="refresh-outline" size={16} color="#0E70E3" style={{ marginRight: 6 }} />
                  <Text style={styles.secondaryButtonText}>Mark as Not Visited (Undo)</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.actionButtonGroup}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => {
                    if (onStartCheckIn) {
                      onStartCheckIn(visit.id);
                    } else {
                      handleToggle();
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.primaryButtonText}>Start Check-In & Mark Visited</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => setIsEditing(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="pencil-outline" size={16} color="#0E70E3" style={{ marginRight: 6 }} />
                  <Text style={styles.secondaryButtonText}>Edit Visit Details</Text>
                </TouchableOpacity>
              </View>
            )}
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
    maxHeight: '88%',
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
    marginBottom: 14,
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
    fontSize: 20,
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
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeNotVisited: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
  },
  badgeVisited: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  tagIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  textNotVisited: {
    color: '#0E70E3',
  },
  textVisited: {
    color: '#10B981',
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  locationTagText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  sectionBox: {
    backgroundColor: '#F8FBFE',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDF4FC',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sectionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  detailTextWrapper: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    color: '#0D2646',
    fontWeight: '500',
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#EDF4FC',
    marginVertical: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0D2646',
    marginTop: 4,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  actionButtonGroup: {
    gap: 10,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E70E3',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  secondaryButtonText: {
    color: '#0E70E3',
    fontSize: 14,
    fontWeight: '600',
  },
});
