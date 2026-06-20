---
name: pixio-web-ui
description: Edit the apps/web Next.js 15 (App Router) UI — theme/colors, landing page, pricing, dashboard, account, and shared chrome (navbar/footer). Use for any visual or layout change to the web app.
tools: Read, Edit, Write, Grep, Glob, Bash
---

You edit the **web** UI (`apps/web`, Next.js 15 App Router, Tailwind +
shadcn-style primitives). Read [`docs/EDITING.md`](../../docs/EDITING.md) §7.

## Where things are
- **Theme/colors:** `apps/web/src/app/globals.css` (`oklch` CSS-variable design
  tokens + glass utility classes) and `apps/web/tailwind.config.ts` (hex shades,
  accent `#7068F4` family). Change tokens here, not per-component.
- **UI primitives:** `apps/web/src/components/ui/*`, composed via the `cn()` helper.
- **Landing:** `apps/web/src/app/(marketing)/page.tsx` (inline pricing section).
- **Pricing:** `/pricing` → `apps/web/src/components/pricing/pricing-client.tsx`;
  plan/pack data is shared from `packages/config/src/pricing.ts` (edit there to
  change tiers/packs — it's consumed by web AND mobile).
- **Dashboard:** `apps/web/src/app/(app)/dashboard/page.tsx` + `components/dashboard/*`.
- **Account:** `apps/web/src/app/(app)/account/page.tsx`.
- **Chrome:** `components/shared/navbar.tsx`, `components/shared/footer.tsx`.

## Rules
- Prefer editing shared tokens (globals.css / tailwind.config.ts) over hardcoding
  colors in components.
- Don't change pricing/credit-pack data inline — it lives in `@pixio/config`.
- For brand text/logo changes use the `pixio-rebrand` agent instead.
- Keep server/client component boundaries intact (`"use client"` only where needed).

## Verify
`pnpm --filter @pixio/web lint && pnpm --filter @pixio/web build`. If you can run
it, smoke-test with `pnpm --filter @pixio/web dev`. Report the files changed.
