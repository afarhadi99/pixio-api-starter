# @pixio/mobile

Expo Router app (SDK 56) with three tabs — **Generate**, **Assets**, and **Settings**. It shares Supabase auth, Pixio generation, and Stripe billing with `@pixio/web` via `/api/mobile/*` routes.

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| Node ≥ 20.19 | Same as monorepo root |
| pnpm 10+ | `pnpm install` from repo root |
| Android Studio / Xcode | For native dev builds |
| Running `@pixio/web` | Mobile calls `EXPO_PUBLIC_API_URL` for generation and payments |

**Do not use Expo Go.** This app requires a **development build** (`expo-dev-client`) because of native modules (`@stripe/stripe-react-native`, `expo-glass-effect`, etc.). Expo Go is the wrong SDK version and lacks those modules.

## Environment

Copy `apps/mobile/.env.example` → `apps/mobile/.env.local`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:3000    # not localhost on a physical device
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

- **`EXPO_PUBLIC_API_URL`**: Base URL of the Next.js app (no trailing slash). Use your machine’s LAN IP when testing on a phone/emulator, not `localhost`.
- **`EXPO_PUBLIC_*`**: Baked in at build time; restart Metro after changes.

## Running (development build)

### First time (or after native dependency / plugin changes)

From the **repo root**:

```bash
pnpm install
pnpm --filter @pixio/mobile prebuild          # generates android/ and ios/
pnpm --filter @pixio/mobile android           # compile, install dev client, start Metro
# or: pnpm --filter @pixio/mobile ios
```

`expo run:android` / `expo run:ios` compiles the native app with `expo-dev-client` embedded and installs it on the emulator or connected device.

### Day-to-day

```bash
pnpm dev:mobile          # expo start --dev-client
```

With Metro running, press **`a`** (Android) or **`i`** (iOS), or open the dev client app manually — it connects to Metro automatically.

You can also run:

```bash
pnpm --filter @pixio/mobile android
```

which rebuilds if needed, installs, and starts Metro.

### Clean native rebuild

```bash
pnpm --filter @pixio/mobile prebuild:clean
pnpm --filter @pixio/mobile android
```

## Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `start` | `expo start --dev-client` | Metro for dev build (not Expo Go) |
| `android` | `expo run:android` | Build/install Android dev client |
| `ios` | `expo run:ios` | Build/install iOS dev client |
| `prebuild` | `expo prebuild` | Generate native projects |
| `prebuild:clean` | `expo prebuild --clean` | Regenerate native projects from scratch |
| `test` | `jest` | Unit/component tests |
| `typecheck` | `tsc --noEmit` | TypeScript check |

Root shortcut: `pnpm dev:mobile` → `@pixio/mobile start`.

## App icons & splash (Pixio parity)

Icons match the main **Pixio** mobile app (`pixio-supabase-turbo` / `apps/mobile`):

| Asset | Path | Use |
|-------|------|-----|
| App icon (iOS + fallback) | `assets/images/icon.png` | `expo.icon` in `app.json` |
| Android adaptive foreground | `assets/images/android-icon-foreground.png` | Adaptive icon layer |
| Android adaptive background | `assets/images/android-icon-background.png` | Adaptive icon layer |
| Android themed / dynamic icon | `assets/images/android-icon-monochrome.png` | Android 13+ monochrome layer |
| Splash (Android) | `assets/images/pixio-icon.png` | `expo-splash-screen` plugin |
| Web favicon | `assets/images/favicon.png` | Expo web export |

`app.json` configures:

```json
"android": {
  "adaptiveIcon": {
    "foregroundImage": "./assets/images/android-icon-foreground.png",
    "monochromeImage": "./assets/images/android-icon-monochrome.png",
    "backgroundImage": "./assets/images/android-icon-background.png"
  }
}
```

The `assets/expo.icon/` folder holds Expo’s liquid-glass icon source (used by tooling); runtime icons use the PNGs above.

After changing icons, run **`prebuild:clean`** and rebuild the dev client so native launcher assets update.

## Expo config plugins

Plugins declared in `app.json`:

| Plugin | Required |
|--------|----------|
| `expo-dev-client` | Yes — dev build entry point |
| `expo-router` | Yes |
| `expo-secure-store` | Yes — auth storage on native |
| `expo-splash-screen` | Yes — Android splash image |
| `@stripe/stripe-react-native` | Yes — PaymentSheet |
| `expo-status-bar` | Optional status bar config |

**Not a config plugin** (dependency only — do **not** add to `plugins`):

- `expo-glass-effect` — runtime UI library; listing it under `plugins` causes `PluginError: Unexpected token 'typeof'`.

## Metro & Supabase (React Native)

`@supabase/supabase-js` pulls in Node’s `ws` package for server environments. Metro cannot bundle Node built-ins like `stream`.

**Fix:** `metro.config.js` stubs Node-only modules (`ws`, `stream`, `crypto`, etc.) to `shims/empty.js`. Supabase Realtime on device uses React Native’s built-in `WebSocket` instead.

Client setup: `src/lib/supabase.ts` uses `@react-native-async-storage/async-storage` for session persistence and `react-native-url-polyfill`.

If you add packages that import Node core modules, extend the stub list in `metro.config.js`.

Monorepo resolution: Metro watches the workspace root and resolves `@pixio/*` packages from `packages/`.

## Design

- **iOS**: Liquid glass via `expo-glass-effect` (`Surface` component).
- **Android**: Material elevation + ripple (`Surface` fallback).
- **Generate**: Krea Flux (image) by default; same Pixio models as web.
- **Assets**: Grid with view, regenerate, download, share, delete.
- **Settings**: Subscription tier, credits, native Stripe.

## Mobile API (`@pixio/web`)

All routes require `Authorization: Bearer <supabase_access_token>` unless noted.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/mobile/config` | Pricing tiers, credit packs, publishable key |
| POST | `/api/mobile/generate` | Queue generation |
| DELETE | `/api/mobile/generate` | Cancel in-flight generation |
| DELETE | `/api/mobile/media/:id` | Delete media + storage |
| POST | `/api/mobile/payment-intent` | Credit pack → PaymentSheet params |
| POST | `/api/mobile/subscription` | Subscription → PaymentSheet params |
| POST | `/api/mobile/portal` | Stripe customer portal URL |

Generation flow matches web: Pixio webhooks → `/api/webhooks/pixio` → Supabase → Realtime to clients.

## Native Stripe

1. **Credit packs**: `POST /api/mobile/payment-intent` → present PaymentSheet.
2. **Subscriptions**: `POST /api/mobile/subscription` → incomplete subscription + PaymentSheet.
3. Webhooks on `@pixio/web` grant credits and sync subscription rows.

Merchant ID (iOS): `merchant.com.mytsi.pixiolite` in `app.json` and root layout.

## Tests

```bash
pnpm --filter @pixio/mobile test
pnpm --filter @pixio/mobile typecheck
```

E2E (dev build required):

```bash
maestro test apps/mobile/.maestro/smoke.yaml
```

Set `MAESTRO_TEST_EMAIL` and `MAESTRO_TEST_PASSWORD`.

## Troubleshooting

### Metro opens Expo Go / wrong SDK version

Uninstall **Expo Go** from the device/emulator. Run:

```bash
pnpm --filter @pixio/mobile android
```

Only the **Pixio Lite** dev client (package `com.mytsi.pixiolite`) should remain.

### `Unexpected token 'typeof'` / `expo-glass-effect` plugin error

Remove `expo-glass-effect` from `app.json` → `plugins`. Keep it in `package.json` dependencies only.

### `attempted to import the Node standard library module "stream"` (Supabase / `ws`)

Ensure `metro.config.js` includes the Node module stubs and `shims/empty.js` exists. Clear Metro cache:

```bash
pnpm --filter @pixio/mobile start -- --clear
```

### `expo-splash-screen` plugin not found

Run `pnpm install` from repo root so workspace deps link correctly.

### API / auth errors on device

- Use LAN IP in `EXPO_PUBLIC_API_URL`, not `localhost`.
- Ensure `@pixio/web` is running and reachable from the device.
- For Android emulator, `10.0.2.2` maps to host `localhost` if needed.

### Icons not updating on device

```bash
pnpm --filter @pixio/mobile prebuild:clean
pnpm --filter @pixio/mobile android
```

## Related docs

- [AGENTS.md](../../AGENTS.md) — monorepo rules for agents and contributors
- [README.md](../../README.md) — root quick start
- [Pixio API docs](https://pixio-api-docs.vercel.app/docs/api)
