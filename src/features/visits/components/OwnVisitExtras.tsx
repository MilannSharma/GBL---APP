import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logger } from '@/core/logger';
import { t } from '@/core/i18n';
import { colors } from '@/core/theme/colors';
import { radii, spacing } from '@/core/theme/spacing';
import { useVisitDetail } from '../hooks/useEntityQueries';
import { usePlaceName } from '../hooks/usePlaceName';

function openMap(latitude: number, longitude: number): void {
  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`).catch(
    (error: unknown) => {
      logger.warn('Could not open the map', { error: error instanceof Error ? error.message : String(error) });
    }
  );
}

interface VisitPlaceProps {
  latitude: number;
  longitude: number;
}

/** Where the visit was recorded: the place name when the phone can resolve it, always a Maps link. */
function VisitPlace({ latitude, longitude }: VisitPlaceProps) {
  const { data: placeName } = usePlaceName(latitude, longitude);
  const label = placeName ?? t('visits.hospital.location');

  return (
    <TouchableOpacity
      style={styles.locationRow}
      onPress={() => openMap(latitude, longitude)}
      accessibilityRole="link"
      accessibilityLabel={`${label}. ${t('visits.hospital.openMap')}`}
    >
      <Ionicons name="location" size={18} color={colors.primary} />
      <View style={styles.locationBody}>
        <Text style={styles.place} numberOfLines={2}>
          {label}
        </Text>
        <Text style={styles.mapLink}>{t('visits.hospital.openMap')}</Text>
      </View>
      <Ionicons name="open-outline" size={18} color={colors.primary} />
    </TouchableOpacity>
  );
}

/**
 * Selfie and location of a visit. The server only serves these for the agent's own visits
 * (`/agent/visit/profile`), so this is rendered for those only; on any failure it shows nothing.
 */
export function OwnVisitExtras({ visitId }: { visitId: string }) {
  const { data: visit } = useVisitDetail(visitId);
  if (!visit) return null;

  return (
    <View style={styles.container}>
      {visit.selfieUrl ? (
        <Image
          source={{ uri: visit.selfieUrl }}
          style={styles.selfie}
          resizeMode="cover"
          accessibilityLabel={t('visits.hospital.selfie')}
        />
      ) : null}
      {visit.latitude !== undefined && visit.longitude !== undefined ? (
        <VisitPlace latitude={visit.latitude} longitude={visit.longitude} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: spacing.sm },
  selfie: { width: '100%', height: 180, borderRadius: radii.card, backgroundColor: colors.surfaceMuted },
  locationRow: { flexDirection: 'row', alignItems: 'center', minHeight: 44, marginTop: spacing.xs },
  locationBody: { marginLeft: spacing.sm, flex: 1 },
  place: { fontSize: 13, fontWeight: '600', color: colors.text },
  mapLink: { fontSize: 12, fontWeight: '600', color: colors.primary, marginTop: 1 },
});
