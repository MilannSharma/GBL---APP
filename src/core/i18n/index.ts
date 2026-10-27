export const translations = {
  en: {
    common: {
      appName: 'Field Agent',
      loading: 'Loading...',
      retry: 'Retry',
      save: 'Save',
      cancel: 'Cancel',
      submit: 'Submit',
      offline: 'You are currently offline. Changes will sync automatically.',
      synced: 'All changes synced',
      syncing: 'Syncing changes...',
      syncFailed: 'Sync failed. Tap to retry.',
    },
    auth: {
      loginTitle: 'Welcome Back',
      phonePlaceholder: 'Enter your phone number',
      getOtp: 'Get OTP',
      verifyOtp: 'Verify OTP',
      otpTitle: 'Verify Code',
    },
    visits: {
      todayTitle: "Today's Schedule",
      emptyTitle: 'No visits scheduled for today',
      checkIn: 'Check In',
      checkOut: 'Check Out',
      statusAssigned: 'Assigned',
      statusInProgress: 'In Progress',
      statusCompleted: 'Completed',
    },
  },
} as const;

export type TranslationKeys = typeof translations.en;

export const t = (keyPath: string): string => {
  const parts = keyPath.split('.');
  let current: unknown = translations.en;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return keyPath;
    }
  }
  return typeof current === 'string' ? current : keyPath;
};
