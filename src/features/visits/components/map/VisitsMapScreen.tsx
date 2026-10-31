import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Region } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/core';
import { t } from '@/core/i18n';
import { useNetwork } from '@/hooks';
import { useLiveLocation } from '../../hooks/useLiveLocation';
import { MapStop, useVisitsMap } from '../../hooks/useVisitsMap';
import { hospitalHref, hospitalOfVisit } from '../../navigation';
import { HospitalMarker } from './HospitalMarker';
import { MapControls } from './MapControls';
import { frameRegion } from './frame-region';
import { lightMapStyle } from './light-map-style';
import { MapHeader } from './MapHeader';
import { VisitedSheet } from './VisitedSheet';

const USER_ZOOM_DELTA = 0.02;
/** Visits Map: today's visits as a numbered timeline route, plus the agent's live position. */
export function VisitsMapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isConnected } = useNetwork();
  const mapRef = useRef<MapView>(null);
  const regionRef = useRef<Region | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  // Opens as a full-screen map; the agent pulls the visits list up when needed.
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [sheetHeight, setSheetHeight] = useState(0);
  const { stops, routeStops, missingCoordinateCount, isLoading, isError, refetch } = useVisitsMap();
  const live = useLiveLocation();

  const routeCoordinates = useMemo(
    () => routeStops.flatMap((stop) => (stop.coordinate ? [stop.coordinate] : [])),
    [routeStops]
  );

  // Frame the route and the agent together when the visits change or the first GPS fix arrives.
  // The latest fix lives in a ref so later GPS updates do not re-frame the map and fight panning.
  const hasUserFix = live.coordinate !== null;
  const liveCoordinateRef = useRef(live.coordinate);
  useEffect(() => {
    liveCoordinateRef.current = live.coordinate;
  }, [live.coordinate]);
  useEffect(() => {
    if (!isMapReady) return;
    const user = liveCoordinateRef.current;
    const points = user ? [...routeCoordinates, user] : routeCoordinates;
    if (points.length === 0) return;
    mapRef.current?.animateToRegion(frameRegion(points), 400);
  }, [isMapReady, routeCoordinates, hasUserFix]);

  const handleLocate = useCallback(() => {
    if (!live.coordinate) return;
    mapRef.current?.animateToRegion(
      { ...live.coordinate, latitudeDelta: USER_ZOOM_DELTA, longitudeDelta: USER_ZOOM_DELTA },
      350
    );
  }, [live.coordinate]);

  const handleZoom = useCallback((factor: number) => {
    const region = regionRef.current;
    if (!region) return;
    mapRef.current?.animateToRegion(
      { ...region, latitudeDelta: region.latitudeDelta * factor, longitudeDelta: region.longitudeDelta * factor },
      250
    );
  }, []);

  const handlePressStop = useCallback(
    (stop: MapStop) => {
      // The hospital page gets its name and address from the params, so pass the whole entity.
      const entity = hospitalOfVisit(stop.visit);
      if (entity) router.push(hospitalHref(entity));
    },
    [router]
  );

  const notice = !isConnected
    ? t('visits.map.offline')
    : live.status === 'denied'
      ? t('visits.map.locationDenied')
      : missingCoordinateCount > 0
        ? t('visits.map.missingCoords').replace('{count}', String(missingCoordinateCount))
        : null;

  return (
    <View style={styles.screen}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        userInterfaceStyle="light"
        customMapStyle={lightMapStyle}
        showsUserLocation={live.status === 'granted'}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        onMapReady={() => setIsMapReady(true)}
        onRegionChangeComplete={(region) => {
          regionRef.current = region;
        }}
      >
        {routeCoordinates.length > 1 ? (
          <>
            {/* Soft outer glow, then the solid line on top, so the route reads clearly on any tile. */}
            <Polyline coordinates={routeCoordinates} strokeColor="rgba(15, 111, 222, 0.25)" strokeWidth={11} lineCap="round" lineJoin="round" />
            <Polyline coordinates={routeCoordinates} strokeColor={colors.primary} strokeWidth={5} lineCap="round" lineJoin="round" />
          </>
        ) : null}
        {routeStops.map((stop) => (
          <HospitalMarker key={stop.visit.id} stop={stop} onPressStop={handlePressStop} />
        ))}
      </MapView>

      <View style={[styles.top, { paddingTop: insets.top + spacing.sm }]} pointerEvents="box-none">
        <View style={styles.topFade} pointerEvents="none" />
        <MapHeader
          stopCount={stops.length}
          onBack={() => router.back()}
          onOpenNotifications={() => router.push('/notifications')}
        />
        {live.status === 'granted' && live.placeName ? (
          <View style={styles.hereChip}>
            <View style={styles.hereDot} />
            <Text style={styles.hereText} numberOfLines={1}>
              {t('visits.map.you')} · {live.placeName}
            </Text>
          </View>
        ) : null}
        {notice ? (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>{notice}</Text>
          </View>
        ) : null}
      </View>

      {isLoading ? (
        <View style={styles.center} pointerEvents="none">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.centerCard}>
          <Text style={styles.centerTitle}>{t('visits.map.loadError')}</Text>
          <TouchableOpacity
            style={styles.retry}
            onPress={() => refetch()}
            accessibilityRole="button"
            accessibilityLabel={t('common.retry')}
          >
            <Text style={styles.retryText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : stops.length === 0 ? (
        <View style={styles.centerCard} pointerEvents="none">
          <Text style={styles.centerTitle}>{t('visits.map.emptyTitle')}</Text>
          <Text style={styles.centerBody}>{t('visits.map.emptyBody')}</Text>
        </View>
      ) : null}

      <View style={[styles.controls, { bottom: sheetHeight + spacing.lg }]} pointerEvents="box-none">
        <MapControls onLocate={handleLocate} onZoomIn={() => handleZoom(0.5)} onZoomOut={() => handleZoom(2)} />
      </View>

      <View
        style={styles.bottom}
        pointerEvents="box-none"
        onLayout={(event) => setSheetHeight(event.nativeEvent.layout.height)}
      >
        <VisitedSheet
          stops={stops}
          isCollapsed={isCollapsed}
          onSetCollapsed={setIsCollapsed}
          onPressStop={handlePressStop}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  top: { position: 'absolute', top: 0, left: 0, right: 0 },
  // Soft white wash so the title and subtitle stay readable on top of busy map tiles.
  topFade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(255, 255, 255, 0.82)', bottom: spacing.xl },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  controls: { position: 'absolute', right: 0, left: 0, zIndex: 20, elevation: 20 },
  hereChip: {
    alignSelf: 'flex-start',
    marginLeft: spacing.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    maxWidth: '75%',
  },
  hereDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  hereText: { fontSize: 12, fontWeight: '700', color: colors.white, flexShrink: 1 },
  notice: {
    alignSelf: 'flex-start',
    marginLeft: spacing.screenPadding,
    marginTop: spacing.sm,
    backgroundColor: colors.warningSoft,
    borderColor: colors.warningBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    maxWidth: '80%',
  },
  noticeText: { fontSize: 11, fontWeight: '600', color: colors.warningText },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  centerCard: {
    position: 'absolute',
    top: '38%',
    alignSelf: 'center',
    maxWidth: '80%',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    alignItems: 'center',
    elevation: 6,
  },
  centerTitle: { fontSize: 15, fontWeight: '800', color: colors.primaryDark, textAlign: 'center' },
  centerBody: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 4 },
  retry: {
    marginTop: spacing.md,
    minHeight: 44,
    paddingHorizontal: spacing.xl,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: { color: colors.white, fontWeight: '700' },
});
