import React, { useState } from 'react';
import { t } from '@/core/i18n';
import { useMeterPhoto } from '../hooks/useMeterPhoto';
import { useShiftLocation } from '../hooks/useShiftLocation';
import type { VehicleType } from '../types';
import { ShiftModalShell } from './ShiftModalShell';
import { VehicleSelector } from './VehicleSelector';
import { OdometerField } from './OdometerField';
import { MeterPhotoField } from './MeterPhotoField';
import { ShiftLocationBadge } from './ShiftLocationBadge';
import { ShiftNotice } from './ShiftNotice';
import { ShiftSubmitButton } from './ShiftSubmitButton';

export interface StartWorkShiftModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (params: {
    initialReading: number;
    startMeterUri: string;
    vehicle: VehicleType;
  }) => Promise<boolean>;
  loading?: boolean;
  serverError?: string | null;
  /** Replaces the default subtitle, e.g. to explain why the shift form came up. */
  subtitle?: string;
}

export function StartWorkShiftModal({
  visible,
  onClose,
  onSubmit,
  loading = false,
  serverError = null,
  subtitle,
}: StartWorkShiftModalProps) {
  const [vehicle, setVehicle] = useState<VehicleType>('BIKE');
  const [reading, setReading] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const photo = useMeterPhoto();
  const location = useShiftLocation(visible);

  // Clear the previous attempt's error each time the sheet opens.
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setValidationError(null);
  }

  const handleSubmit = async () => {
    const value = Number(reading.trim());
    if (!reading.trim() || !Number.isFinite(value) || value <= 0) {
      setValidationError(t('worklog.errReadingInvalid'));
      return;
    }
    if (!photo.photoUri) {
      setValidationError(t('worklog.errPhotoRequired'));
      return;
    }
    setValidationError(null);

    const isSuccess = await onSubmit({
      initialReading: value,
      startMeterUri: photo.photoUri,
      vehicle,
    });
    if (isSuccess) {
      setReading('');
      photo.reset();
      onClose();
    }
  };

  const message = validationError ?? photo.error ?? serverError;

  return (
    <ShiftModalShell
      visible={visible}
      title={t('worklog.startTitle')}
      subtitle={subtitle ?? t('worklog.startSubtitle')}
      iconName="play"
      onClose={onClose}
    >
      <VehicleSelector value={vehicle} onChange={setVehicle} />
      <OdometerField
        label={t('worklog.initialReadingLabel')}
        value={reading}
        onChangeText={(next) => {
          setReading(next);
          setValidationError(null);
        }}
      />
      <MeterPhotoField
        photoUri={photo.photoUri}
        isCapturing={photo.isCapturing}
        onCapture={photo.capture}
      />
      <ShiftLocationBadge status={location.status} label={location.label} onRetry={location.retry} />
      {message ? <ShiftNotice message={message} /> : null}
      <ShiftSubmitButton
        label={t('worklog.confirmStart')}
        iconName="play-circle"
        isLoading={loading}
        onPress={handleSubmit}
      />
    </ShiftModalShell>
  );
}
