import { useCallback, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { permissions } from '@/core/permissions';
import { logger } from '@/core/logger';
import { t } from '@/core/i18n';

/** Front-camera selfie for a visit. EXIF is never requested (no location leak). */
export function useSelfie() {
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(async () => {
    setError(null);
    const hasPermission = await permissions.requestCameraPermission();
    if (!hasPermission) {
      setError(t('visits.add.errCameraDenied'));
      return;
    }

    setIsCapturing(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        cameraType: ImagePicker.CameraType.front,
        quality: 0.7,
        allowsEditing: false,
        exif: false,
      });
      const uri = result.canceled ? undefined : result.assets[0]?.uri;
      if (uri) setSelfieUri(uri);
    } catch (err: unknown) {
      logger.warn('Selfie capture failed', { error: err instanceof Error ? err.message : String(err) });
      setError(t('visits.add.errCaptureFailed'));
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSelfieUri(null);
    setError(null);
  }, []);

  return { selfieUri, isCapturing, error, capture, reset };
}
