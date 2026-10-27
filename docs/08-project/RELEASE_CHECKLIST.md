# Release Checklist [DRAFT]

## Before build
- [ ] All P0/P1 bugs closed
- [ ] QA checklist passed
- [ ] Security checklist passed (`05-security/SECURITY.md`)
- [ ] Version and changelog updated
- [ ] Production env values verified
- [ ] Min app version set on backend

## Store assets
- [ ] Icon, splash, screenshots (phone sizes)
- [ ] Description, keywords, support URL, privacy policy URL
- [ ] Privacy labels (Apple), Data safety (Play)
- [ ] Reviewer test account and notes

## Release
- [ ] Production build tested on real devices
- [ ] Submit to TestFlight / Play internal -> beta -> production
- [ ] Staged rollout started

## After release
- [ ] Monitor crashes and sync errors for 48h
- [ ] Rollback or flag plan ready
- [ ] Retro and backlog update
