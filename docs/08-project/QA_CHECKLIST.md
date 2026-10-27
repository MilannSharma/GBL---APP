# QA Regression Checklist [DRAFT]

Run on Android (low-end + mid) and iOS before each release.

## Auth
- [ ] Login success / failure / locked account
- [ ] Session persists after kill and reopen
- [ ] Expired token flow
- [ ] Logout with pending items warns

## Visits and hospitals
- [ ] Today list, upcoming, done tabs
- [ ] Pull to refresh, empty state, error state
- [ ] Directions and call work

## Check-in / out
- [ ] Permission allow, deny, deny forever
- [ ] GPS off, low accuracy, too far
- [ ] Offline check-in syncs once

## Form, media, signature
- [ ] Validation, draft autosave, kill mid-form
- [ ] Photo capture, gallery, limit, remove
- [ ] Signature draw, clear, save
- [ ] 10 photos upload on slow network

## Offline and sync
- [ ] Airplane mode full visit
- [ ] Reconnect auto-sync, order preserved
- [ ] Failed item retry
- [ ] No duplicates after force quit

## Notifications
- [ ] Tap in foreground, background, killed
- [ ] Logout stops pushes

## General
- [ ] Rotation locked as designed, safe areas
- [ ] Large font and screen reader pass
- [ ] Low storage behavior
- [ ] Upgrade from previous build keeps data (migration)
- [ ] No sensitive data in logs
- [ ] Version/build number correct
