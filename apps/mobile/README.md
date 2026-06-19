# @pixio/mobile

Expo Router app for Pixio with three native tabs — **Generate** (home), **Assets**, and **Settings** (subscription + credits). Auth and data go through Supabase (RLS); generation and payments go through the `@pixio/web` `/api/mobile/*` endpoints.

## Setup

1. Copy env: `cp .env.example .env.local` and fill in:
   - `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_API_URL` — base URL of the deployed/running `@pixio/web` app
   - `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
2. From the repo root: `pnpm install`.

## Running

The native Stripe SDK requires a **dev build** (not Expo Go):

```bash
pnpm --filter @pixio/mobile prebuild      # generate native projects
pnpm --filter @pixio/mobile ios           # or: android
```

For UI-only work without the native module you can still use `pnpm dev:mobile`.

## Native Stripe

- **Credit packs** (one-time): `POST /api/mobile/payment-intent` → PaymentSheet.
- **Subscriptions** (full native): `POST /api/mobile/subscription` creates a
  `default_incomplete` subscription and returns the PaymentIntent client secret,
  confirmed on-device via PaymentSheet. The Stripe webhook grants credits /
  syncs the subscription.

## Tests

- Unit/component: `pnpm --filter @pixio/mobile test` (Jest + Testing Library).
- E2E: `maestro test .maestro/smoke.yaml` against a dev build (set
  `MAESTRO_TEST_EMAIL` / `MAESTRO_TEST_PASSWORD`).
