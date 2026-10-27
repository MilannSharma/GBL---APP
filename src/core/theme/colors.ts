export const colors = {
  primary: '#0F6FDE',
  primaryDark: '#0A4FA3',
  accent: '#0FB5AE',
  success: '#1E9E5A',
  warning: '#E59A00',
  danger: '#D93025',
  info: '#4F6BED',
  bg: '#F6F8FB',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#64748B',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(15, 23, 42, 0.5)',
} as const;

export type ColorToken = keyof typeof colors;
