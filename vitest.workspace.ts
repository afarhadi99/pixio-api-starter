import { defineWorkspace } from 'vitest/config';

// Each package runs its own `vitest run`; this workspace lets you run the whole
// suite from the repo root with `pnpm vitest`.
export default defineWorkspace([
  'packages/config',
  'packages/credits',
  'packages/billing',
  'packages/generation',
]);
