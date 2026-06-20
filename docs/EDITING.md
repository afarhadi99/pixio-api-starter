# Editing Guide

A practical, task-oriented guide for modifying this project. It covers the
monorepo layout, local setup, and step-by-step recipes for the most common
changes: **adding a generation model**, **rebranding the app**, **editing the
web UI**, **editing the mobile UI**, and **testing on a device**.

> There are matching Claude Code subagents in [`.claude/agents/`](../.claude/agents)
> (`pixio-add-model`, `pixio-rebrand`, `pixio-web-ui`, `pixio-mobile-ui`,
> `pixio-guide`) that automate each of these recipes. Ask Claude e.g.
> *"use the pixio-add-model agent to add a Flux Pro model"*.

---

## 1. Architecture at a glance

This is a **pnpm + Turborepo monorepo**.

```
pixio-api-starter/
├─ apps/
│  ├─ web/      @pixio/web      Next.js 15 (App Router) — marketing, auth, dashboard, ALL API routes
│  └─ mobile/   @pixio/mobile   Expo Router (React Native) — 3 screens: Generate / Assets / Account
├─ packages/
│  ├─ config/      @pixio/config       pure TS: pricing tiers + credit packs (NOT per-generation cost)
│  ├─ database/    @pixio/database     Database types + admin client factory + query helpers
│  ├─ credits/     @pixio/credits      credit ops (server): useCredits, add/reset, ensureUserCredits
│  ├─ billing/     @pixio/billing      Stripe (server): checkout, portal, PaymentIntent, ephemeral key, sync
│  └─ generation/  @pixio/generation   Pixio API client, PIXIO_MODELS catalog, queueGeneration, webhook processor
├─ tooling/        @pixio/{eslint-config,prettier-config,tsconfig}   shared dev config
├─ pnpm-workspace.yaml   workspaces + a `catalog:` that pins shared dep versions
├─ turbo.json            task graph + the env-var passthrough allowlist
└─ package.json          root scripts delegate to turbo
```

**Key principles**

- **Shared logic lives in `packages/*` and is platform-agnostic.** Server-only
  functions take an *injected* client (e.g. a Supabase admin client or a Stripe
  client) rather than importing one, so the same code runs from Next.js routes.
- **One backend.** The mobile app has **no server of its own** — it calls the
  web app's `apps/web/src/app/api/mobile/*` routes with a Supabase JWT
  (`Authorization: Bearer <token>`, resolved by `getRequestUser`). The web app's
  thin `@/lib/*` files are re-export shims that bind the packages to singletons.
- **Generation is webhook-driven** (no Supabase edge functions): `queueGeneration`
  → Pixio queue with a `webhook_url` → `apps/web/src/app/api/webhooks/pixio/route.ts`
  → `processPixioWebhook` downloads media → Supabase Storage → DB row → Realtime.
- **"Pixio" is overloaded.** It is both *this app's brand* **and** the name of the
  external AI generation service the app integrates with. Branding changes must
  not touch the service integration — see [§6](#6-rebrand--rename-the-app).

---

## 2. Prerequisites & setup

- **Node** 20+, **pnpm 10** (`corepack enable` then `pnpm -v`).
- A **Supabase** project, a **Stripe** account (test mode), and **Pixio**
  deployment credentials.
- For mobile: the **Expo dev build** installed on a device/simulator
  (`@stripe/stripe-react-native` needs a dev build, not Expo Go).

```bash
pnpm install                    # install the whole workspace
```

Environment files:
- `apps/web/.env.local` — copy from [`apps/web/env.example`](../apps/web/env.example).
  Supabase URL/keys, Stripe keys + webhook secret, `PIXIO_DEPLOY_API_KEY`, the
  `DEPLOYMENT_ID_*` per-model UUIDs, and `NEXT_PUBLIC_SITE_URL`.
- `apps/mobile/.env` — `EXPO_PUBLIC_API_URL` (the web deployment URL),
  `EXPO_PUBLIC_SUPABASE_URL`/`_ANON_KEY`, `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- **`turbo.json`** has an `env`/`globalEnv` allowlist — any **new** env var a
  built/cached task reads must be added there or Turbo may run with a stale value.

---

## 3. Commands

Run from the repo root (Turbo fans out across the workspace):

| Task | Command |
|---|---|
| Dev (all) | `pnpm dev` |
| Dev web only | `pnpm --filter @pixio/web dev` |
| Dev mobile (Metro, dev client) | `pnpm --filter @pixio/mobile start` |
| Typecheck | `pnpm typecheck` (or `--filter @pixio/<pkg>`) |
| Lint | `pnpm lint` |
| Test | `pnpm test` (Vitest in packages, Jest in mobile, Playwright in web) |
| Build | `pnpm build` |
| Mobile native build | `pnpm --filter @pixio/mobile android` / `… ios` |
| Regenerate native projects | `pnpm --filter @pixio/mobile prebuild:clean` |

Supabase migrations live in `apps/web/supabase/migrations/`.

---

## 4. The generation model: how it actually works

There is one important quirk to understand before adding a model: **the codebase
conflates "model" and "generation mode".** Each model maps 1:1 to a hardcoded
**mode string**, and `queueGeneration()` dispatches on that string with an
`if/else` chain (not a generic model id). The three existing modes:

| mode string | model | output |
|---|---|---|
| `image` | Krea Flux | image |
| `video` | Qwen Edit | **image** (the name is misleading — it edits/returns an image) |
| `firstLastFrameVideo` | Wan 2.2 | video |

The **model catalog + dispatch + credit logic is written once** in
`@pixio/generation` and shared by both apps. Only the **two form UIs** (web
dashboard + mobile Generate screen) are duplicated and must be kept in sync.

---

## 5. Recipe: add a new AI generation model

Adding a model = adding a new **mode** end-to-end. The mode string must be
**byte-identical** everywhere it appears. TypeScript catches most omissions
(the mode type is derived from a `const` tuple), but the mobile `ModelId` union
and some string switches are separate — grep to be safe.

**In `packages/generation/`:**

1. **`src/pixio-api.ts`** — add an `Inputs` interface (mirror `KreaFluxInputs`),
   a `PixioModel` definition (mirror `KREA_FLUX`; pull `deploymentId` from
   `process.env.DEPLOYMENT_ID_* || 'fallback-uuid'`), and register it in the
   `PIXIO_MODELS` catalog. `getModelById`/`getModelByDeploymentId` iterate the
   catalog, so they pick it up automatically.
2. **`src/media.ts`** — add the credit cost to `CREDIT_COSTS` keyed by the new
   mode (value = `PIXIO_MODELS.x.creditCost` — never hardcode the number), and
   add the mode string to the `GENERATION_MODES` const tuple. Only extend the
   `MediaType` union (`'image' | 'video'`) for a genuinely new output kind.
3. **`src/generate.ts`** — add any new optional fields to the `GenerateParams`
   union; in `queueGeneration()` add (a) mode validation, (b) correct
   `mediaType` selection if it outputs video, and (c) a dispatch branch that sets
   `selectedModel = PIXIO_MODELS.x`, builds the typed `inputs`, and calls
   `createRunRequest(...)`. Import the new `Inputs` type at the top.
4. **`src/webhook.ts`** — usually **no change** (generic download/store). Only
   touch `extractOutputUrl` / the content-type switch for an unusual output shape.

**Env / config:**

5. Add `DEPLOYMENT_ID_*` to **`apps/web/env.example`**, **`apps/web/.env.local`**
   (the real UUID), and the **`turbo.json`** env allowlist.

**Web UI (`apps/web/`):**

6. **`src/lib/actions/media.actions.ts`** — add an `else if (generationMode === '<mode>')`
   branch reading the new fields off `FormData` into the `GenerateParams`.
7. **`src/components/dashboard/media-generation-form.tsx`** — add a mode flag, an
   input render block, validation in `handleSubmit`, the `FormData.append`s, the
   submit-disabled condition, and a `getMediaType` case if video.
8. **`src/app/(app)/dashboard/page.tsx`** — bump the `TabsList` `grid-cols-N`, add
   a `TabsTrigger value="<mode>"` (label `PIXIO_MODELS.x.name`) and a
   `TabsContent` rendering `<MediaGenerationForm generationMode="<mode>" creditCost={CREDIT_COSTS.x} … />`.
   *(`apps/web/src/app/api/mobile/generate/route.ts` and `src/lib/{pixio-api,constants/media}.ts`
   are generic shims — no change.)*

**Mobile UI (`apps/mobile/`):**

9. **`app/(tabs)/index.tsx`** — extend the `ModelId` union, add to the `MODELS`
   array (the picker renders it automatically), add an `onGenerate` branch
   building `GenerateParams`, add a validation `Alert`, add a per-model options
   block in the `BottomSheet` (with matching `useState` hooks). The prompt uses
   the always-visible top composer; only put **secondary** options in the sheet.
   *(`src/components/generation/model-picker-sheet.tsx` and `src/lib/api.ts` are
   generic — no change.)*

**Verify:** `pnpm --filter @pixio/generation test` (add a Vitest case for the new
branch), then `pnpm typecheck`. Grep the old mode strings to confirm nothing was
missed. Confirm the deployment ID is set before a live generation.

---

## 6. Rebrand / rename the app

Split the work in two. **Phase A is safe** (display strings + assets, no
rebuild). **Phase B is deeper** (identifiers; needs an Expo prebuild/rebuild).

> ⚠️ **Do NOT blindly find-replace "Pixio".** Env vars `PIXIO_DEPLOY_API_KEY` /
> `DEPLOYMENT_ID_*`, the webhook path `/api/webhooks/pixio`,
> `apps/web/src/lib/pixio-api.ts`, the `@pixio/generation` `PIXIO_MODELS` catalog,
> and marketing copy like "powered by Pixio API" refer to the **external
> generation service** — leave them unless you're replacing that backend too.
> The `@pixio/*` **npm scope** (workspace package names) is internal-only; renaming
> it touches ~78 import sites + manifests + lockfile and is **optional**.

**Phase A — display name & copy (safe):**
- **Mobile:** `apps/mobile/app.json` → `expo.name`, `ios.infoPlist.CFBundleDisplayName`;
  `apps/mobile/android/app/src/main/res/values/strings.xml` → `app_name`;
  `apps/mobile/android/settings.gradle` → `rootProject.name`;
  `apps/mobile/app/(auth)/login.tsx` → the visible "Pixio Lite" heading.
- **Web:** `apps/web/src/lib/config/metadata.ts` is the **branding hub** (title,
  siteName, descriptions, keywords, author, social handles/URLs, the fallback
  domain `pixio-api-starter.vercel.app`, app-store ids, JSON-LD, theme color).
  Visible wordmarks: `components/shared/navbar.tsx`, `components/shared/footer.tsx`,
  `app/(auth)/layout.tsx`, `app/(auth)/signup/page.tsx`, and the hero H1 in
  `app/(marketing)/page.tsx`.
- **Assets:** replace in place to avoid code edits — `apps/web/public/metadata/*`
  + `apps/web/public/screenshot.png`; `apps/mobile/assets/images/*` (if you rename
  `pixio-icon.png`/`pixio-logo.png`, update `app.json` splash + `login.tsx` `require`).

**Phase B — identifiers (needs prebuild/rebuild):**
- `apps/mobile/app.json` → `expo.slug`, `expo.scheme`, `ios.bundleIdentifier`,
  `android.package`, Stripe plugin `merchantIdentifier`.
- Native files must match: `apps/mobile/app/_layout.tsx` `StripeProvider merchantIdentifier`,
  `android/app/build.gradle` `namespace`/`applicationId`,
  `android/app/src/main/AndroidManifest.xml` deep-link schemes, and the Kotlin
  package dir `android/app/src/main/java/com/mytsi/pixiolite/`.
  **Safest:** edit `app.json`, delete `android/`, run `pnpm --filter @pixio/mobile prebuild:clean`.

**Verify:** `pnpm --filter @pixio/web build`, `pnpm --filter @pixio/mobile typecheck`;
for native changes `prebuild:clean` then `… android`.

---

## 7. Edit the web UI (`apps/web`, Next.js 15 App Router)

- **Theme / colors:** design tokens are `oklch` CSS variables in
  `apps/web/src/app/globals.css`; hex shades + the accent (`#7068F4` family) in
  `apps/web/tailwind.config.ts`. Primitives are in `apps/web/src/components/ui/*`
  (composed via the `cn()` helper).
- **Landing page:** `apps/web/src/app/(marketing)/page.tsx` (has an inline pricing
  section); the standalone `/pricing` uses `components/pricing/pricing-client.tsx`.
  Plan/pack data is shared from `packages/config/src/pricing.ts`.
- **Dashboard:** `apps/web/src/app/(app)/dashboard/page.tsx` (the generation tabs)
  + `components/dashboard/*`. **Account:** `apps/web/src/app/(app)/account/page.tsx`.
- **Chrome:** `components/shared/navbar.tsx` + `footer.tsx`.

---

## 8. Edit the mobile UI (`apps/mobile`, Expo Router / React Native)

The mobile app reproduces the Pixio "frosted liquid-glass over an animated
gradient-orb background" look.

**Two color systems:**
- `src/constants/theme.ts` — base `Colors`/`Fonts`/`Spacing` (used by `useTheme`
  + `ThemedText`/`ThemedView`).
- `src/components/settings/settings-colors.ts` → **`useSettingsColors()`** is the
  rich hook everything else uses. It has **three per-platform branches** (Android
  Material-You dynamic colors, iOS hex palette, web fallback). **A new color key
  must be added to all three returned objects** or TS drops it; cast
  `colors.key as string` for RN style props.

**Common edits:**
- **Theme/accent:** `useSettingsColors` — iOS `primary` (~L57), Android dynamic
  branch (~L14), web fallback (~L78).
- **Typography/spacing:** `src/components/themed-text.tsx` type styles; `Spacing` in
  `theme.ts`.
- **A screen:** `app/(tabs)/index.tsx` (Generate), `app/(tabs)/assets.tsx`,
  `app/(tabs)/account.tsx` — all wrapped in `ScreenShell` (`src/components/screen-shell.tsx`).
- **Add a settings card:** new component under `src/components/settings/` returning
  `SettingsCard` + `SettingsActionButton` (copy `account-settings-card.tsx` or
  `credits-balance-card.tsx`), add icons to `settings.constants.ts` `SETTINGS_SYMBOLS`,
  and mount it in a section of `account.tsx`.
- **Bottom tab bar:** `src/components/collapsing-tab-bar.tsx` (3 links that collapse
  into a corner pill on scroll), wired in `app/(tabs)/_layout.tsx`. Adding a tab
  needs three synced edits: `TABS`/`TAB_ORDER`, a `Tabs.Screen`, and the route file.
- **Bottom sheet / drawer:** `src/components/generation/bottom-sheet.tsx` — an
  in-tree edge-to-edge overlay (NOT a RN `Modal`) that fills to the bottom and
  lifts above the keyboard via `useAnimatedKeyboard`. It hides the tab bar while
  open via `pushOverlay`/`popOverlay` on the bottom-menu context.
- **Gallery (Generate feed):** `src/components/gallery/generated-gallery.tsx` (a
  one-at-a-time `pagingEnabled` pager) + `asset-action-row.tsx` (circular actions).

**Critical glass/blur constraint:** never render `expo-blur`'s `BlurView` /
`BlurTargetView` on Android — live blur on the RenderThread caused a native
`SIGSEGV`. Use `IosGlassSurface` (`src/components/ui/ios-glass-surface.tsx`),
which renders the native `GlassView` only on eligible iOS and a **translucent
`View` fallback** (`colors.blurFallback`) everywhere else. `SettingsFrostedView`
wraps it; always pass `fallbackBackgroundColor`.

**Verify:** `pnpm --filter @pixio/mobile typecheck && pnpm --filter @pixio/mobile lint`.

---

## 9. Test on a device

Use the **`adb-device-testing`** skill (installed globally in `~/.claude/skills/`)
to drive a connected Android phone like a real user. The loop:

1. `adb devices` (reconnect if `offline`) → start Metro on **8081**
   (`pnpm --filter @pixio/mobile start`) → `adb reverse tcp:8081 tcp:8081`.
2. `adb logcat -c` → `adb shell am force-stop com.mytsi.pixiolite` → relaunch via
   `adb shell am start -a android.intent.action.VIEW -d "exp+pixiolite://expo-development-client/?url=http://localhost:8081"`.
3. Poll `adb logcat -d | grep 'Running "main"'`; check `adb logcat -b crash -d`.
4. `adb exec-out screencap -p > shot.png` to view; `adb shell input tap/swipe/text`
   to interact (coords are **real pixels** — use `adb shell wm size`).
5. For precise layout questions ("does it reach the bottom?"), read pixels with
   Python + Pillow instead of trusting a scaled screenshot.

See the skill file for the full, copy-pasteable commands and gotchas.

---

## 10. Gotchas (things that bite)

- **Model = mode string**, identical across the generation package, both apps,
  and the mobile `ModelId` union. Grep old mode strings when adding/renaming.
- **Web and mobile generation forms are duplicated** — the package only de-dups
  the catalog/dispatch/credits. Edit both, keep inputs/validation in sync.
- **Per-generation credit cost is single-sourced** on `PIXIO_MODELS.x.creditCost`;
  `CREDIT_COSTS` re-maps it by mode. `packages/config` holds only subscription
  tiers + credit packs.
- **New env vars** must be added to `turbo.json`'s allowlist.
- **Mobile app-router files are under `apps/mobile/app/`**, but components, lib,
  constants, and hooks are under **`apps/mobile/src/`**.
- **No committed `ios/` dir** (managed/prebuild workflow) — the iOS bundle id
  lives only in `app.json` and is generated at prebuild time.
- **Don't render `BlurView` on Android** (native crash) — see §8.
- The root **`AGENT.md` is a stale pre-monorepo guide** (single-app paths). This
  `docs/EDITING.md` supersedes it for file locations.
