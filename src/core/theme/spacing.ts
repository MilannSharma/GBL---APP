export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  screenPadding: 16,
} as const;

export const radii = {
  input: 8,
  button: 8,
  card: 12,
  chip: 999,
  full: 9999,
} as const;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radii;
