# TASK-024: Streamline Profile Screen with Single Entry Point, Edit Avatar & Claymorphism Default
- Feature: F01 Navigation, F04 Profile
- Page: P04 Profile Screen
- Priority: P1
- Owner (human): Human Owner
- Agent role(s): Planner / Implementer
- Status: done

## Goal (1-2 lines)
Consolidate profile information into a single card (removing redundant "Profile" menu row), replace full-body toon character with a high-quality 3D claymorphism bust avatar, and add a camera edit button to update the profile photo with camera/gallery image picker.

## In scope
1. **Single Profile Entry Point:**
   - Remove redundant "Profile: View your details and performance" row from the menu list.
   - The top Agent Card serves as the sole, unified entry point for full Agent Information (name, phone, email, agent ID, territory, shift status).
2. **Claymorphism Bust Avatar:**
   - Replace the full-body character in the profile card with the new 3D claymorphism circular avatar (`assets/default-clay-avatar.png`).
3. **Edit Profile Photo Feature:**
   - Add an edit camera badge overlay (`<Feather name="camera" />`) on the avatar.
   - Allow agent to tap and pick a photo from Camera or Gallery using `expo-image-picker`.
   - Persist custom avatar URI via `storage` key `user_custom_avatar_uri` so uploaded pictures remain persistent across app restarts.
   - Allow resetting back to default claymorphism avatar.
4. **Clean Menu List:**
   - Only non-redundant operational destinations: Visits, Visits Map, Expenses, Settings, Help & Support.

## Out of scope
- Server-side avatar upload endpoint (stored in app-private persistent secure storage).

## Spec links
- UI reference: `Ui Refrence image/profile & expense.png`

## Acceptance criteria
- [x] No redundant "Profile" menu item in the options list.
- [x] Default avatar is the 3D claymorphism bust avatar (`assets/default-clay-avatar.png`).
- [x] Camera badge appears on avatar; tapping prompts Camera / Gallery picker.
- [x] Picked photo updates immediately and persists across restarts.
- [x] `yarn typecheck` passes with 0 errors.

## Evidence
- `yarn typecheck`: Passed with 0 errors in 13.60s.


## Test plan
- Run `yarn typecheck`.
- Test photo picker and persistence.
- Verify clean menu layout.
