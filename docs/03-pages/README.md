# Pages (Screens) Index [DRAFT]

One file per screen. Each links to its feature spec in `02-features/`.

| ID | Screen | Route | Feature |
|---|---|---|---|
| P01 | Splash | `index` | F01 |
| P02 | Login | `(auth)/login` | F01 |
| P03 | OTP Verify | `(auth)/otp` | F01 |
| P04 | Home (Today) | `(tabs)/index` | F02 |
| P05 | Visits List | `(tabs)/visits` | F02 |
| P06 | Visit Detail | `visit/[id]` | F02 |
| P07 | Hospital Detail | `hospital/[id]` | F03 |
| P08 | Check-in | `visit/[id]/check-in` | F04 |
| P09 | Visit Form | `visit/[id]/form` | F05 |
| P10 | Camera and Photos | `visit/[id]/photos` | F06 |
| P11 | Signature | `visit/[id]/signature` | F06 |
| P12 | Review and Check-out | `visit/[id]/review` | F04, F05 |
| P13 | Submit Success | `visit/[id]/done` | F05 |
| P14 | History List | `(tabs)/history` | F09 |
| P15 | History Detail | `history/[id]` | F09 |
| P16 | Notifications | `notifications` | F08 |
| P17 | Profile | `(tabs)/profile` | F10 |
| P18 | Settings | `settings` | F10 |
| P19 | Sync Status | `sync` | F07 |
| P20 | Force Update / Maintenance | `system/update` | F11 |

## Global states (apply to every screen)
Loading skeleton, Empty, Error with retry, Offline banner, Permission denied.
