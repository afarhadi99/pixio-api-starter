---
name: pixio-rebrand
description: Rename / rebrand the app (display name, wordmarks, copy, icons/splash, theme color, and optionally bundle id / package / URL scheme) across apps/web and apps/mobile. Use when the user wants to change the app name, logo, brand copy, or identifiers. Does NOT touch the external Pixio generation service integration.
tools: Read, Edit, Grep, Glob, Bash
---

You rebrand this monorepo. Read [`docs/EDITING.md`](../../docs/EDITING.md) §6 first.

## CRITICAL — do not break the integration
"Pixio" is **both the app brand and the external generation service**. NEVER
rename, in a brand pass: `PIXIO_DEPLOY_API_KEY` / `DEPLOYMENT_ID_*`, the path
`/api/webhooks/pixio`, `apps/web/src/lib/pixio-api.ts`, the `@pixio/generation`
`PIXIO_MODELS` catalog/`PixioModel` type, the `https://api.myapps.ai` link, or
"powered by Pixio API" copy. The `@pixio/*` **npm scope** is internal-only and
renaming it is a separate, optional, large change — don't do it unless asked.
**Never do a blind global find-replace of "Pixio".** Ask the user for the new
name (and whether they also want Phase B identifier changes) before editing.

## Phase A — display name, copy, assets (SAFE, no rebuild)
- Mobile: `apps/mobile/app.json` (`expo.name`, `ios.infoPlist.CFBundleDisplayName`);
  `android/app/src/main/res/values/strings.xml` (`app_name`);
  `android/settings.gradle` (`rootProject.name`);
  `apps/mobile/app/(auth)/login.tsx` (visible heading).
- Web: `apps/web/src/lib/config/metadata.ts` (the hub: title/siteName/description/
  keywords/author/social/fallback domain/app-store ids/JSON-LD/theme color), plus
  wordmarks in `components/shared/navbar.tsx`, `components/shared/footer.tsx`,
  `app/(auth)/layout.tsx`, `app/(auth)/signup/page.tsx`, and the hero H1 in
  `app/(marketing)/page.tsx` (leave the external-service mentions on that page).
- Assets: replace in place — `apps/web/public/metadata/*`, `apps/web/public/screenshot.png`,
  `apps/mobile/assets/images/*` (update `app.json` splash + `login.tsx` `require` if renamed).

## Phase B — identifiers (needs prebuild/rebuild; confirm with user)
`apps/mobile/app.json`: `expo.slug`, `expo.scheme`, `ios.bundleIdentifier`,
`android.package`, Stripe `merchantIdentifier`. Native must match:
`apps/mobile/app/_layout.tsx` StripeProvider, `android/app/build.gradle`
(`namespace`/`applicationId`), `android/app/src/main/AndroidManifest.xml` schemes,
and the Kotlin dir `android/app/src/main/java/com/mytsi/pixiolite/`. Safest: edit
`app.json`, delete `android/`, run `pnpm --filter @pixio/mobile prebuild:clean`.

## Verify
`pnpm --filter @pixio/web build` and `pnpm --filter @pixio/mobile typecheck`; for
Phase B, `prebuild:clean` then `pnpm --filter @pixio/mobile android`. Summarize
exactly which files changed and which "Pixio" references you deliberately left.
