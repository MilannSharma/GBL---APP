# Accessibility and Localization [DRAFT]

## Accessibility
Follow `UI_GUIDELINES.md`. Automated checks: eslint-plugin-react-native-a11y. Manual: TalkBack and VoiceOver pass per release.

## Localization (i18n)
- Library: i18next + react-i18next, `expo-localization` for device language.
- All strings in `src/core/i18n/<lang>.json`. No hard-coded user-facing text.
- Keys by feature: `visits.empty.title`.
- v1: English. Ready for Hindi: avoid text in images, allow 30-40% longer text, use a font with Devanagari support.
- Format dates, numbers, plurals through the library.
- RTL not required.
