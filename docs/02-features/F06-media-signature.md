# F06 Media and Signature [DRAFT]

**Priority:** P0 | **Code:** `src/features/media/` | **Screens:** Camera, Photo Preview, Signature

## Goal
Capture photos and a signature as proof of work.

## User stories
- As an agent, I take photos or pick from gallery.
- As an agent, I get a signature from the hospital contact on the phone screen.

## Requirements
1. Camera with permission handling; gallery pick as fallback.
2. Compress and resize before upload (target max width ~1600px, quality ~0.7; confirm limits in `OPEN_QUESTIONS.md` #8).
3. Strip or keep EXIF per privacy decision (location EXIF off by default).
4. Photo count limit and per-photo remove/retake.
5. Signature pad saves as PNG; clear and redo.
6. Upload runs in the background via the sync queue, with progress and retry.
7. Files are stored in app private storage until uploaded, then cleaned.

## States
No permission, Capturing, Preview, Uploading (percent), Uploaded, Failed (retry).

## API dependencies
`POST /uploads` (multipart) or signed URL flow (see `07-api/modules/uploads.md`).

## Analytics
`photo_added`, `photo_removed`, `signature_saved`, `upload_failed`.

## Acceptance criteria
- [ ] 10 photos upload on a slow network without freezing the UI
- [ ] Upload resumes or retries after app restart
- [ ] Local files are deleted after successful upload
