import React, { useState } from 'react';
import { t } from '@/core/i18n';
import { useMeterPhoto } from '../hooks/useMeterPhoto';
import { useShiftLocation } from '../hooks/useShiftLocation';
import { ShiftModalShell } from './ShiftModalShell';
import { OdometerField } from './OdometerField';
import { MeterPhotoField } from './MeterPhotoField';
import { ShiftLocationBadge } from './ShiftLocationBadge';
import { ShiftNotice } from './ShiftNotice';
import { ShiftSubmitButton } from './ShiftSubmitButton';

export interface EndWorkShiftModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (params: { finalReading: number; endMeterUri: string }) => Promise<boolean>;
  initialReading?: number | null;
  loading?: boolean;
  serverError?: string | null;
}

export function EndWorkShiftModal({
  visible,
  onClose,
  onSubmit,
  initialReading,
  loading = false,
  serverError = null,
}: EndWorkShiftModalProps) {
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
    if (initialReading != null && value < initialReading) {
      setValidationError(
        t('worklog.errReadingBelowInitial')
          .replace('{value}', String(value))
          .replace('{initial}', String(initialReading))
      );
      return;
    }
    if (!photo.photoUri) {
      setValidationError(t('worklog.errPhotoRequired'));
      return;
    }
    setValidationError(null);

    const isSuccess = await onSubmit({ finalReading: value, endMeterUri: photo.photoUri });
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
      title={t('worklog.endTitle')}
      subtitle={t('worklog.endSubtitle')}
      iconName="stop"
      onClose={onClose}
    >
      <OdometerField
        label={t('worklog.finalReadingLabel')}
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
        label={t('worklog.confirmEnd')}
        iconName="stop-circle"
        isLoading={loading}
        onPress={handleSubmit}
      />
    </ShiftModalShell>
  );
}
