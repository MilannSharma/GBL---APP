import { StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { radii, spacing } from '@/core/theme/spacing';

/** Styles shared by the Add Visit sheet and its entity / contact pickers. */
export const addVisitStyles = StyleSheet.create({
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card + 2,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 14,
    color: colors.text,
    minHeight: 44,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  selectPlaceholder: {
    color: colors.textMuted,
  },
  inputSpaced: {
    marginTop: spacing.sm,
  },
  textArea: {
    height: 76,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginTop: spacing.sm,
  },
  rowAction: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  rowIcon: {
    marginRight: spacing.sm,
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  rowTitleAction: {
    color: colors.primary,
  },
  rowSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    paddingHorizontal: spacing.sm,
  },
  statusText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  errorText: {
    fontSize: 13,
    color: colors.danger,
    marginBottom: spacing.md,
  },
});
