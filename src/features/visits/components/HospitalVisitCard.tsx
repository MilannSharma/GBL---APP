import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HospitalVisit } from '../types';

export interface HospitalVisitCardProps {
  visit: HospitalVisit;
  onPress: () => void;
}

export function HospitalVisitCard({ visit, onPress }: HospitalVisitCardProps) {
  const isVisited = visit.status === 'visited';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${visit.hospitalName}, ${visit.address}, ${isVisited ? 'Visited' : 'Not Yet Visited'}`}
    >
      {/* 3D Hospital Building Avatar */}
      <View style={styles.avatarWrapper}>
        <Image
          source={require('../../../../assets/hospital-building.png')}
          style={styles.avatarImage}
          resizeMode="contain"
        />
      </View>

      {/* Main Info Column */}
      <View style={styles.infoCol}>
        <Text style={styles.hospitalName} numberOfLines={1}>
          {visit.hospitalName}
        </Text>

        {/* Location row */}
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={13} color="#64748B" style={styles.detailIcon} />
          <Text style={styles.addressText} numberOfLines={1}>
            {visit.address}
          </Text>
        </View>

        {/* Time and Date row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color="#64748B" style={styles.detailIcon} />
            <Text style={styles.metaText}>{visit.time}</Text>
          </View>
          <View style={[styles.metaItem, styles.metaItemSpaced]}>
            <Ionicons name="calendar-outline" size={13} color="#64748B" style={styles.detailIcon} />
            <Text style={styles.metaText}>{visit.date}</Text>
          </View>
        </View>
      </View>

      {/* Right Column: Status Badge & Chevron */}
      <View style={styles.rightCol}>
        <View style={[styles.statusBadge, isVisited ? styles.badgeVisited : styles.badgeNotVisited]}>
          <Ionicons
            name={isVisited ? 'checkmark-circle' : 'time-outline'}
            size={12}
            color={isVisited ? '#10B981' : '#0E70E3'}
            style={styles.badgeIcon}
          />
          <Text style={[styles.statusText, isVisited ? styles.textVisited : styles.textNotVisited]}>
            {isVisited ? 'Visited' : 'Not Yet Visited'}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={16} color="#94A3B8" style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#0E70E3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF3FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 44,
    height: 44,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  hospitalName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D2646',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 4,
  },
  addressText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItemSpaced: {
    marginLeft: 10,
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 6,
    height: 48,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
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
  badgeIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  textNotVisited: {
    color: '#0E70E3',
  },
  textVisited: {
    color: '#10B981',
  },
  chevron: {
    marginTop: 8,
  },
});
