---
name: pixio-mobile-ui
description: Edit the apps/mobile Expo Router (React Native) UI — theme/colors, the three screens (Generate/Assets/Account), the collapsing tab bar, settings cards, the bottom-sheet/drawer, and the gallery. Use for any visual or layout change to the mobile app.
tools: Read, Edit, Write, Grep, Glob, Bash
---

You edit the **mobile** UI (`apps/mobile`, Expo Router / React Native). Read
[`docs/EDITING.md`](../../docs/EDITING.md) §8.

## Layout
App-router screens live under **`apps/mobile/app/`**; everything else
(components, lib, constants, hooks) under **`apps/mobile/src/`**.

## Two color systems
- `src/constants/theme.ts` — base `Colors`/`Fonts`/`Spacing` (used by `useTheme`
  + `ThemedText`/`ThemedView`).
- `src/components/settings/settings-colors.ts` → **`useSettingsColors()`** is what
  almost everything uses. It returns three per-platform palettes (Android
  Material-You dynamic, iOS hex, web fallback). **Add any new color key to all
  three** branches or TS drops it; cast `colors.key as string` for RN props.

## Where things are
- **Accent/theme:** `useSettingsColors` (iOS `primary` ~L57, Android ~L14, web ~L78).
- **Typography:** `src/components/themed-text.tsx`; spacing in `theme.ts`.
- **Screens:** `app/(tabs)/index.tsx` (Generate), `app/(tabs)/assets.tsx`,
  `app/(tabs)/account.tsx` — all wrapped in `ScreenShell` (`src/components/screen-shell.tsx`).
- **Tab bar:** `src/components/collapsing-tab-bar.tsx` (3 links collapsing to a
  corner pill) wired in `app/(tabs)/_layout.tsx`. New tab = sync `TABS`/`TAB_ORDER`
  + a `Tabs.Screen` + the route file.
- **Settings card:** copy `src/components/settings/account-settings-card.tsx` or
  `credits-balance-card.tsx` (returns `SettingsCard` + `SettingsActionButton`), add
  icons to `settings.constants.ts` `SETTINGS_SYMBOLS`, mount in `account.tsx`.
- **Bottom sheet/drawer:** `src/components/generation/bottom-sheet.tsx`.
- **Gallery:** `src/components/gallery/generated-gallery.tsx` + `asset-action-row.tsx`.

## Hard constraints
- **NEVER render `expo-blur` `BlurView`/`BlurTargetView` on Android** — it caused a
  native `SIGSEGV` on the RenderThread. Use `IosGlassSurface`
  (`src/components/ui/ios-glass-surface.tsx`): native `GlassView` only on eligible
  iOS, translucent `View` fallback (`colors.blurFallback`) elsewhere. Always pass
  `fallbackBackgroundColor`. `SettingsFrostedView` wraps it.
- The bottom sheet is an **in-tree edge-to-edge overlay**, not a RN `Modal`: it
  fills to the physical bottom, lifts above the keyboard via `useAnimatedKeyboard`,
  and hides the tab bar while open via `pushOverlay`/`popOverlay`. Preserve that.
- Use `expo-symbols` SF Symbols on iOS but `@expo/vector-icons` (`Ionicons`) for
  cross-platform icons (the tab bar uses Ionicons for Android reliability).

## Verify
`pnpm --filter @pixio/mobile typecheck && pnpm --filter @pixio/mobile lint`. For a
real visual check, use the **`adb-device-testing`** skill to run it on a device.
Report the files changed.
