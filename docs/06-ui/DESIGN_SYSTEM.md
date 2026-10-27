# Design System [DRAFT]

Brand colors, logo and fonts are [TODO] from the client. Values below are proposals. Implement as tokens in `src/core/theme/`.

## Principles
Clear, calm, fast. Healthcare trust. Big touch targets. One primary action per screen. Works in sunlight and one-handed.

## Colors (proposal)
| Token | Value | Use |
|---|---|---|
| primary | #0F6FDE | Buttons, links, active tab |
| primaryDark | #0A4FA3 | Pressed state |
| accent | #0FB5AE | Highlights |
| success | #1E9E5A | Done, synced |
| warning | #E59A00 | Pending |
| danger | #D93025 | Errors, failed |
| info | #4F6BED | Informational |
| bg | #F6F8FB | Screen background |
| surface | #FFFFFF | Cards |
| border | #E2E8F0 | Dividers |
| text | #0F172A | Primary text |
| textMuted | #64748B | Secondary text |
Contrast must meet WCAG AA (4.5:1 for body text).

## Typography
Font: Inter (or system font). Scale: Display 28/34, H1 24/30, H2 20/26, Body 16/24, Caption 13/18. Weights: 400, 500, 600. Support dynamic type, do not clip.

## Spacing and shape
4px base grid: 4, 8, 12, 16, 24, 32. Screen padding 16. Radius: 8 inputs/buttons, 12 cards, 999 chips. Elevation: subtle, 1-2 levels.

## Components
| Component | Variants / states |
|---|---|
| Button | primary, secondary, ghost, danger; loading, disabled; height 48 |
| Input | default, focus, error, disabled; helper text |
| Card | default, pressable |
| StatusChip | assigned, in progress, completed, cancelled |
| SyncBadge | draft, pending, synced, failed |
| Banner | offline, syncing, error, info |
| Tabs / SegmentedControl | 3 items |
| ListItem | with chevron, with avatar |
| EmptyState | icon + title + action |
| ErrorState | message + retry |
| Skeleton | list, card, detail |
| BottomSheet | confirm, picker |
| Toast | success, error |
| Stepper | form steps |
| Modal / Dialog | confirm destructive actions |

## Status color mapping
Assigned = info, In progress = warning, Completed = success, Cancelled = textMuted. Sync: pending = warning, synced = success, failed = danger.

## Iconography
One set (Lucide or Material Symbols), 24px, 2px stroke, consistent.

## Motion
Short (150-250ms), purposeful, respect "reduce motion".

## Dark mode
Not in v1. Use tokens so it can be added later.
