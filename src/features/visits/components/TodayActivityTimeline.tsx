import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { HospitalVisit } from '../types';

export interface TodayActivityTimelineProps {
  visits: HospitalVisit[];
  isDayStarted: boolean;
  dayStartTime?: string;
  onPressVisit?: (visit: HospitalVisit) => void;
  onAddVisitPress?: () => void;
}

export function TodayActivityTimeline({
  visits = [],
  isDayStarted = false,
  dayStartTime,
  onPressVisit,
  onAddVisitPress,
}: TodayActivityTimelineProps) {
  const router = useRouter();

  const handleCardPress = (visit: HospitalVisit) => {
    if (onPressVisit) {
      onPressVisit(visit);
    } else {
      router.push('/(tabs)/visits');
    }
  };

  const handleAddPress = () => {
    if (onAddVisitPress) {
      onAddVisitPress();
    } else {
      router.push('/(tabs)/visits');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconCircle}>
            <Ionicons name="git-commit-outline" size={20} color="#0E70E3" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Today&apos;s Activity Trail</Text>
            <Text style={styles.headerSubtitle}>
              {visits.length} {visits.length === 1 ? 'visit' : 'visits'} recorded today
            </Text>
          </View>
        </View>

        <View style={[styles.statusBadge, isDayStarted ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
          <View style={[styles.statusDot, isDayStarted ? styles.statusDotActive : styles.statusDotInactive]} />
          <Text style={[styles.statusBadgeText, isDayStarted ? styles.statusBadgeTextActive : styles.statusBadgeTextInactive]}>
            {isDayStarted ? 'Shift Active' : 'Not Started'}
          </Text>
        </View>
      </View>

      {/* Timeline Tree */}
      <View style={styles.timelineBody}>
        {/* NODE 1: Day Start */}
        <View style={styles.timelineItem}>
          {/* Left Line & Node */}
          <View style={styles.nodeColumn}>
            <View style={[styles.nodeCircle, isDayStarted ? styles.startNodeActive : styles.startNodeInactive]}>
              <Ionicons
                name={isDayStarted ? 'play' : 'time'}
                size={13}
                color="#FFFFFF"
                style={{ marginLeft: isDayStarted ? 1 : 0 }}
              />
            </View>
            <View style={[styles.verticalLine, isDayStarted ? styles.lineSolid : styles.lineDashed]} />
          </View>

          {/* Right Content */}
          <View style={styles.contentColumn}>
            <View style={styles.nodeHeaderRow}>
              <Text style={styles.nodeTitle}>Daily Shift Started</Text>
              {isDayStarted && dayStartTime ? (
                <View style={styles.timeTag}>
                  <Ionicons name="time-outline" size={11} color="#0E70E3" style={{ marginRight: 3 }} />
                  <Text style={styles.timeTagText}>{dayStartTime}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.nodeSubtitle}>
              {isDayStarted
                ? 'Checked in for duty. Route & visits logged below.'
                : 'Shift not started yet. Tap Start Day to begin.'}
            </Text>
          </View>
        </View>

        {/* NODE 2..N: Trail of User-Added Visits */}
        {visits.map((visit, index) => {
          const isVisited = visit.status === 'visited';
          return (
            <View key={visit.id || `visit-${index}`} style={styles.timelineItem}>
              {/* Left Column: Node & Connecting Line */}
              <View style={styles.nodeColumn}>
                <View style={[styles.nodeCircle, styles.visitNodeCompleted]}>
                  <Ionicons
                    name="checkmark"
                    size={13}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.verticalLine} />
              </View>

              {/* Right Column: Hospital Visit Details Card */}
              <View style={styles.contentColumn}>
                <TouchableOpacity
                  style={styles.visitCard}
                  activeOpacity={0.8}
                  onPress={() => handleCardPress(visit)}
                >
                  {/* Top: Hospital Name & Timestamp */}
                  <View style={styles.visitTopRow}>
                    <Text style={styles.hospitalName} numberOfLines={1}>
                      {visit.hospitalName}
                    </Text>
                    <View style={styles.timeTag}>
                      <Ionicons name="time-outline" size={11} color="#0E70E3" style={{ marginRight: 3 }} />
                      <Text style={styles.timeTagText}>{visit.time}</Text>
                    </View>
                  </View>

                  {/* Address */}
                  {visit.address ? (
                    <View style={styles.locationRow}>
                      <Ionicons name="location-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.addressText} numberOfLines={1}>
                        {visit.address}
                      </Text>
                    </View>
                  ) : null}

                  {/* Doctor & Dept */}
                  {visit.doctorName ? (
                    <Text style={styles.doctorText} numberOfLines={1}>
                      {visit.doctorName} {visit.department ? `• ${visit.department}` : ''}
                    </Text>
                  ) : null}

                  {/* Bottom: Status Pill & Quick Action */}
                  <View style={styles.visitBottomRow}>
                    <View style={[styles.statusPill, styles.statusPillCompleted]}>
                      <Ionicons
                        name="checkmark-circle"
                        size={12}
                        color="#10B981"
                        style={{ marginRight: 4 }}
                      />
                      <Text style={[styles.statusPillText, styles.statusTextCompleted]}>
                        Visited
                      </Text>
                    </View>

                    <View style={styles.actionLink}>
                      <Text style={styles.actionLinkText}>View Details</Text>
                      <Ionicons name="chevron-forward" size={13} color="#0E70E3" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Empty Trail Message (if 0 visits added) */}
        {visits.length === 0 && (
          <View style={styles.timelineItem}>
            <View style={styles.nodeColumn}>
              <View style={styles.emptyNodeCircle}>
                <Ionicons name="add" size={14} color="#94A3B8" />
              </View>
              <View style={[styles.verticalLine, styles.lineDashed]} />
            </View>

            <View style={styles.contentColumn}>
              <TouchableOpacity
                style={styles.emptyCard}
                onPress={handleAddPress}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyCardTitle}>No Visits in Trail Yet</Text>
                <Text style={styles.emptyCardSubtitle}>
                  Visits you add today will appear here as your field trail with timestamps.
                </Text>
                <View style={styles.addInlineButton}>
                  <Ionicons name="add-circle" size={16} color="#0E70E3" style={{ marginRight: 5 }} />
                  <Text style={styles.addInlineButtonText}>Add First Hospital Visit</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* NODE END: Shift End / Ongoing */}
        <View style={styles.timelineItemLast}>
          <View style={styles.nodeColumnLast}>
            <View style={[styles.nodeCircle, isDayStarted ? styles.endNodeActive : styles.endNodeInactive]}>
              <Ionicons
                name={isDayStarted ? 'navigate' : 'radio-button-off'}
                size={12}
                color="#FFFFFF"
              />
            </View>
          </View>

          <View style={styles.contentColumn}>
            <View style={styles.nodeHeaderRow}>
              <Text style={styles.nodeTitle}>
                {isDayStarted ? 'Field Route in Progress' : 'Day End'}
              </Text>
            </View>
            <Text style={styles.nodeSubtitle}>
              {isDayStarted
                ? 'Your location & trail are active until end of shift.'
                : 'Start your shift above to activate today’s trail.'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderWidth: 1,
    borderColor: '#EDF4FC',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0D2646',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusBadgeActive: {
    backgroundColor: '#ECFDF5',
  },
  statusBadgeInactive: {
    backgroundColor: '#F1F5F9',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusDotActive: {
    backgroundColor: '#10B981',
  },
  statusDotInactive: {
    backgroundColor: '#94A3B8',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadgeTextActive: {
    color: '#10B981',
  },
  statusBadgeTextInactive: {
    color: '#64748B',
  },
  timelineBody: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 64,
  },
  timelineItemLast: {
    flexDirection: 'row',
  },
  nodeColumn: {
    width: 28,
    alignItems: 'center',
  },
  nodeColumnLast: {
    width: 28,
    alignItems: 'center',
  },
  nodeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  startNodeActive: {
    backgroundColor: '#10B981',
  },
  startNodeInactive: {
    backgroundColor: '#94A3B8',
  },
  visitNodeCompleted: {
    backgroundColor: '#10B981',
  },
  visitNodePending: {
    backgroundColor: '#0E70E3',
  },
  emptyNodeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  endNodeActive: {
    backgroundColor: '#3B82F6',
  },
  endNodeInactive: {
    backgroundColor: '#CBD5E1',
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  lineSolid: {
    backgroundColor: '#A7F3D0',
  },
  lineDashed: {
    backgroundColor: '#E2E8F0',
  },
  contentColumn: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 16,
  },
  nodeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nodeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D2646',
  },
  nodeSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  timeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0E70E3',
  },
  visitCard: {
    backgroundColor: '#F8FBFE',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 2,
  },
  visitTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  hospitalName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0D2646',
    flex: 1,
    marginRight: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  addressText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  doctorText: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '500',
    marginBottom: 8,
  },
  visitBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusPillCompleted: {
    backgroundColor: '#ECFDF5',
  },
  statusPillPending: {
    backgroundColor: '#EFF6FF',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextCompleted: {
    color: '#10B981',
  },
  statusTextPending: {
    color: '#0E70E3',
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0E70E3',
    marginRight: 2,
  },
  emptyCard: {
    backgroundColor: '#F8FBFE',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0D2646',
    marginBottom: 3,
  },
  emptyCardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 10,
  },
  addInlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  addInlineButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0E70E3',
  },
});
