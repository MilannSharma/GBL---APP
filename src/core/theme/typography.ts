export const typography = {
  display: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '600' as const,
  },
  h1: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600' as const,
  },
  h2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  captionMedium: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
