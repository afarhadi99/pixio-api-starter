# Web dashboard — library & result preview

How the Next.js dashboard keeps the **media library** and **result preview** in sync without a full page refresh.

## Architecture

1. User submits the generation form → server action creates `generated_media` row (`pending` → `processing`).
2. Pixio completes → `POST /api/webhooks/pixio` sets `status: completed` and `media_url`.
3. UI updates via **Supabase Realtime**, **custom DOM events**, and **polling fallbacks**.

## Required Supabase migrations

Apply on your remote project (`supabase db push` from `apps/web`, or run SQL manually). Migration files live in `apps/web/supabase/migrations/` in this monorepo.

| Migration | Purpose |
|-----------|---------|
| `20260619120000_enable_generated_media_realtime.sql` | Adds `generated_media` to `supabase_realtime` publication |
| `20260619130000_create_generated_media_storage_bucket.sql` | Public `generated-media` bucket + storage RLS |

Without Realtime, the library and preview still update via polling (every 3s while in-flight).

## Key files

| File | Role |
|------|------|
| `apps/web/src/components/dashboard/media-generation-form.tsx` | Form + right-side result preview |
| `apps/web/src/components/dashboard/media-library.tsx` | Library grid + Realtime + polling |
| `apps/web/src/lib/constants/media-events.ts` | `pixio:generation-started`, `pixio:media-record-updated` |
| `packages/supabase/src/lib/client.ts` | Singleton browser Supabase client (stable Realtime) |
| `apps/web/src/app/api/webhooks/pixio/route.ts` | Webhook → storage upload → `completed` row |

## Result preview behavior

The preview panel uses **one slot** (not layered overlays):

1. **Loading** — spinner while the active generation has no `media_url` yet.
2. **Result** — image/video replaces the spinner in the same area when `status === completed` and `media_url` is non-empty.
3. **Empty** — placeholder when there is no prior result.
4. **Failed** — error state when generation fails.

Loading stays visible until `resultMediaId === currentMediaId` **and** a trimmed non-empty `media_url` exists. Empty-string URLs from the initial insert do not count as a result.

The form polls the active row every 3s, subscribes to Realtime for that `id`, and listens for `pixio:media-record-updated` events dispatched from the library.

## Library behavior

- On `pixio:generation-started`, fetches the new row immediately.
- Realtime channel per user on `generated_media` INSERT/UPDATE/DELETE.
- Polls every 3s while any row is `pending` or `processing`.
- `syncRecentMedia` upserts rows (does not only append).

## Local webhooks

Pixio must reach your webhook URL. For local dev:

1. Run ngrok (or similar) to expose port 3000.
2. Set `NEXT_PUBLIC_SITE_URL` to the tunnel URL.
3. Configure Pixio deployment webhooks to `{SITE_URL}/api/webhooks/pixio`.

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Library updates only after refresh | Realtime migration not applied; check browser console for `CHANNEL_ERROR` |
| Preview stuck on loading forever | Webhook not reaching app; row never gets `media_url` |
| Preview empty after loading stops | Row `completed` but `media_url` still blank — check webhook logs |
| Bucket not found on upload | Storage migration not applied |
