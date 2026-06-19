# AGENTS.md

Guidance for AI coding agents working in the **Pixio API Starter** monorepo.

## Repository layout

```
apps/
  web/          Next.js 15 SaaS app (auth, dashboard, webhooks, mobile API)
  mobile/       Expo Router app (3 tabs: Generate, Assets, Settings)
packages/
  config/       Pricing tiers, credit packs, env schema
  database/     Supabase types, admin client, query helpers
  credits/      Credit ledger (use, top-up, reset)
  billing/      Stripe sync, checkout, native PaymentSheet helpers, webhooks
  generation/   Pixio API client, queueGeneration, webhook processor, storage
tooling/        Shared eslint, prettier, tsconfig
```

## Architecture rules

1. **Business logic lives in `packages/*`**, not in app route files. Apps bind singletons (Supabase admin, Stripe) via thin shims under `apps/web/src/lib/*`.
2. **Generation is webhook-based** — never poll Pixio. The web app receives callbacks at `/api/webhooks/pixio`. Do not add Supabase Edge Functions for generation.
3. **Mobile auth** uses Supabase + Bearer tokens. Mobile calls `@pixio/web` at `/api/mobile/*`; use `getRequestUser()` for cookie OR bearer auth.
4. **Native Stripe** on mobile uses PaymentSheet. Server creates PaymentIntent / incomplete subscription; webhooks grant credits and sync subscriptions.
5. **Same Pixio models as web** — catalog in `@pixio/generation/pixio` (`kreaFlux`, `qwenEdit`, `wanFirstLastFrame`). Mobile Generate tab uses Krea Flux (image); regenerate reuses stored `metadata.generationMode`.

## Common commands

From repo root (requires **pnpm**, Node ≥ 20.19):

```bash
pnpm install
pnpm typecheck          # all packages + apps
pnpm test               # unit tests (Vitest + Jest)
pnpm build              # production build (web)
pnpm dev:web            # Next.js on :3000
pnpm dev:mobile         # Expo dev server
pnpm --filter @pixio/web supabase:start   # local Supabase
```

## Environment

- **Web**: copy `apps/web/env.example` → `apps/web/.env.local`
- **Mobile**: copy `apps/mobile/.env.example` → `apps/mobile/.env.local`
- Required: Supabase URL/keys, Stripe keys + price IDs, Pixio deployment IDs, `NEXT_PUBLIC_SITE_URL` (ngrok for local webhooks)

## Testing expectations

| Area | Tool | Location |
|------|------|----------|
| Packages | Vitest | `packages/*/src/*.test.ts` |
| Web | Vitest + Playwright scaffold | `apps/web` |
| Mobile | Jest + Testing Library | `apps/mobile/src/**/*.test.ts(x)` |
| Mobile E2E | Maestro | `apps/mobile/.maestro/smoke.yaml` |

Run `pnpm test` before handing off. Do not commit `.next/`, `node_modules/`, or secrets.

## UI conventions (mobile)

- **iOS**: liquid glass via `expo-glass-effect` (`Surface` component)
- **Android**: Material elevation surfaces + ripple on buttons
- Three tabs only: Generate (home), Assets, Settings
- Asset detail actions: view, regenerate, download, share, delete

## PR / commit checklist

- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes
- [ ] Web builds: `pnpm --filter @pixio/web build` (with valid `.env.local`)
- [ ] New API routes documented in `apps/mobile/README.md` if mobile-facing
- [ ] No secrets in git

## Docs

- Public setup: root `README.md`
- Mobile: `apps/mobile/README.md`
- Pixio API: https://pixio-api-docs.vercel.app/docs/api
