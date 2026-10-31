import React, { memo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/core';
import { t } from '@/core/i18n';
import { MapStop } from '../../hooks/useVisitsMap';

export interface HospitalMarkerProps {
  stop: MapStop;
  onPressStop: (stop: MapStop) => void;
}

/** One timeline stop: numbered pin, 3D hospital, Visited tag and a name + area card. */
function HospitalMarkerBase({ stop, onPressStop }: HospitalMarkerProps) {
  // Custom marker views are snapshotted; keep tracking until the image has drawn.
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  if (!stop.coordinate) return null;

  const { visit, order } = stop;
  const area = visit.city ?? visit.address;

  return (
    <Marker
      coordinate={stop.coordinate}
      anchor={{ x: 0.2, y: 0.9 }}
      tracksViewChanges={!isImageLoaded}
      onPress={() => onPressStop(stop)}
      accessibilityLabel={`${visit.hospitalName}, stop ${order}`}
    >
      <View style={styles.wrap}>
        <View style={styles.building}>
          <View style={styles.pin}>
            <Text style={styles.pinText}>{order}</Text>
          </View>
          <Image
            source={require('@/../assets/hospital-3d-pin.png')}
            style={styles.image}
            onLoad={() => setIsImageLoaded(true)}
          />
        </View>
        <View style={styles.info}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{t('visits.map.visited')}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.name} numberOfLines={2}>
              {visit.hospitalName}
            </Text>
            {area ? (
              <View style={styles.areaRow}>
                <Ionicons name="location-outline" size={11} color={colors.textMuted} />
                <Text style={styles.area} numberOfLines={1}>
                  {area}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Marker>
  );
}

export const HospitalMarker = memo(HospitalMarkerBase);

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end' },
  building: { width: 72, height: 84, alignItems: 'center', justifyContent: 'flex-end' },
  image: { width: 72, height: 72, resizeMode: 'contain' },
  pin: {
    position: 'absolute',
    top: 0,
    zIndex: 2,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinText: { fontSize: 12, fontWeight: '800', color: colors.white },
  info: { marginLeft: -spacing.xs, marginBottom: spacing.sm, maxWidth: 150 },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.success,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginBottom: 2,
  },
  tagText: { fontSize: 10, fontWeight: '700', color: colors.white },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: { fontSize: 12, fontWeight: '800', color: colors.primaryDark },
  areaRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  area: { fontSize: 10, color: colors.textMuted, flexShrink: 1 },
});
