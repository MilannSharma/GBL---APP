# Folder Structure [DRAFT]

```
field-agent-app/
  app/                              # Expo Router: routes only, thin files
    _layout.tsx
    index.tsx
    (auth)/
      _layout.tsx
      login.tsx
      otp.tsx
    (tabs)/
      _layout.tsx
      index.tsx                     # Home
      visits.tsx
      history.tsx
      profile.tsx
    visit/[id]/
      index.tsx
      check-in.tsx
      form.tsx
      photos.tsx
      signature.tsx
      review.tsx
      done.tsx
    hospital/[id].tsx
    history/[id].tsx
    notifications.tsx
    settings.tsx
    sync.tsx
    system/update.tsx
  src/
    features/                       # one folder per feature (F01..F10)
      auth/
        components/
        hooks/
        api.ts                      # calls src/api/endpoints/auth
        store.ts                    # zustand (if needed)
        schemas.ts                  # zod
        types.ts
        index.ts                    # public exports only
      visits/
      hospitals/
      checkin/
      visit-form/
      media/
      sync/
      notifications/
      history/
      profile/
    api/
      client.ts                     # axios instance + interceptors
      errors.ts
      endpoints/                    # auth.ts, visits.ts, hospitals.ts, ...
      types/                        # raw API types
    db/
      client.ts
      migrations/
      schema.ts
      repositories/                 # visits.repo.ts, hospitals.repo.ts, outbox.repo.ts
    core/
      config/                       # env, constants
      theme/                        # tokens, colors, spacing, typography
      i18n/                         # en.json, hi.json
      providers/                    # QueryProvider, AuthProvider, NetworkProvider
      analytics/
      logger/
      permissions/
      storage/                      # secure-store wrapper
      utils/
    components/                     # shared UI (Button, Input, Card, ...)
    hooks/                          # shared hooks (useNetwork, useAppState)
    types/                          # global types
  assets/                           # images, fonts, icons
  docs/                             # this documentation
  __tests__/                        # or colocated *.test.ts(x)
  .env.development / .env.staging / .env.production
  app.config.ts
  eas.json
  tsconfig.json
  .eslintrc.js / .prettierrc
```

## Rules
1. Files in `app/` only compose screens from `src/features`. No logic.
2. A feature exposes only what is in its `index.ts`.
3. File naming: components `PascalCase.tsx`, hooks `useThing.ts`, others `kebab-case.ts`.
4. One component per file, one responsibility per hook.
5. Tests live next to code: `Thing.test.tsx`.
6. No default exports except route files.
