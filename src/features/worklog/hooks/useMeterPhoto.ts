import { useCallback, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { permissions } from '@/core/permissions';
import { logger } from '@/core/logger';
import { t } from '@/core/i18n';

/** Camera capture for the odometer photo. EXIF is never requested (no location leak). */
export function useMeterPhoto() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(async () => {
    setError(null);
    const hasPermission = await permissions.requestCameraPermission();
    if (!hasPermission) {
      setError(t('worklog.errCameraDenied'));
      return;
    }

    setIsCapturing(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        allowsEditing: false,
        exif: false,
      });
      const uri = result.canceled ? undefined : result.assets[0]?.uri;
      if (uri) {
        setPhotoUri(uri);
      }
    } catch (err: unknown) {
      logger.warn('Meter photo capture failed', {
        error: err instanceof Error ? err.message : String(err),
      });
      setError(t('worklog.errCaptureFailed'));
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPhotoUri(null);
    setError(null);
  }, []);

  return { photoUri, isCapturing, error, capture, reset };
}
