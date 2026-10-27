# UI Guidelines [DRAFT]

## Layout
- Safe areas respected on all devices.
- Primary action in thumb reach (bottom). Sticky action bar on forms.
- Max one primary button per screen.
- Support 360px to 430px widths; test small Android (360x640).

## Navigation
Bottom tabs: Today, Visits, History, Profile. Stack for flows. Back always works. No dead ends.

## Content
- Plain language, short labels, verbs on buttons ("Check in", "Submit visit").
- Show time as local, 12h or 24h per locale. Dates like "26 Oct".
- Empty states say what to do next.
- Error messages say what happened and how to fix it. No raw error codes.

## Forms
Label above field, inline validation, correct keyboard type, "Next" moves to next field, no losing data on error, autosave drafts.

## Feedback
Loading skeletons instead of spinners for lists, inline progress for uploads, toasts for success, banners for persistent states (offline).

## Offline and sync UX
Always show state: offline banner, per-item badge, last updated. Never show a blocking spinner because of network. Text: "Saved. Will sync when online."

## Permissions UX
Explain before the system prompt. If denied, show how to enable in Settings with a button.

## Accessibility
- Tap targets 44x44 minimum
- Screen reader labels, roles and states
- Contrast AA, do not rely on color alone (icon + text on status)
- Dynamic font size up to 200% without breaking
- Reduce motion respected
- Test with TalkBack and VoiceOver

## Quality checklist per screen
- [ ] All states designed (loading, empty, error, offline, success)
- [ ] Small and large phone checked
- [ ] Keyboard does not hide inputs
- [ ] Back and gesture navigation work
- [ ] Haptics and sounds optional and subtle
