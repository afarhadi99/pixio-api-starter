# @pixio/mobile

Expo Router app for Pixio with three native tabs — **Generate** (home), **Assets**, and **Settings** (subscription + credits).

## Design

- **iOS**: Liquid glass surfaces via `expo-glass-effect` (`Surface` component), matching the Pixio mobile aesthetic.
- **Android**: Material Design elevated surfaces with ripple feedback on buttons.
- **Generate**: Krea Flux image model (same as web dashboard default).
- **Assets**: Grid of generations; tap to open detail with **view**, **regenerate**, **download**, **share**, **delete**.
- **Settings**: Subscription tier, credit balances, native Stripe subscribe / buy credits.

Auth and realtime data use Supabase (RLS). Generation and payments go through `@pixio/web` `/api/mobile/*` endpoints with Bearer auth.

## Setup

1. Copy env: `cp .env.example .env.local` and fill in:
   - `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_API_URL` — base URL of the running `@pixio/web` app (e.g. `http://localhost:3000`)
   - `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
2. From repo root: `pnpm install`.

## Running

Native Stripe requires a **dev build** (not Expo Go):

```bash
pnpm --filter @pixio/mobile prebuild
pnpm --filter @pixio/mobile ios     # or: android
```

For UI-only iteration: `pnpm dev:mobile` (Stripe flows need a dev build).

## Mobile API (web app)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/mobile/config` | Pricing tiers, credit packs, publishable key |
| POST | `/api/mobile/generate` | Queue generation (Bearer auth) |
| DELETE | `/api/mobile/generate` | Cancel running generation |
| DELETE | `/api/mobile/media/:id` | Delete media + storage file |
| POST | `/api/mobile/payment-intent` | Credit pack PaymentSheet params |
| POST | `/api/mobile/subscription` | Native subscription PaymentSheet params |
| POST | `/api/mobile/portal` | Stripe customer portal URL |

## Native Stripe

- **Credit packs**: `POST /api/mobile/payment-intent` → PaymentSheet.
- **Subscriptions**: `POST /api/mobile/subscription` creates a `default_incomplete` subscription; PaymentSheet confirms on-device. Stripe webhooks sync credits and subscription state.

## Tests

```bash
pnpm --filter @pixio/mobile test          # Jest unit/component
maestro test apps/mobile/.maestro/smoke.yaml   # E2E (dev build)
```

Set `MAESTRO_TEST_EMAIL` and `MAESTRO_TEST_PASSWORD` for the smoke flow.
