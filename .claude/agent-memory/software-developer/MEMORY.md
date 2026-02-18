# Software Developer Agent Memory

## Project Structure
- Components: `shared/components/ui/<name>/<name>.tsx`
- Old stubs at `shared/components/ui/<name>.tsx` are comment-only tombstones (no exports)
- Path alias `@/*` maps to repo root, so `@/shared/lib/utils/cn` works
- BaseUI package: `@base-ui-components/react` with sub-path exports e.g. `@base-ui-components/react/button`

## Key Files
- `shared/lib/utils/cn.ts` — `cn()` utility (clsx + tailwind-merge)
- `tailwind.config.ts` — poker color tokens under `poker.*` namespace
- `app/globals.css` — CSS variables for shadcn-style colors
- `app/layout.tsx` — Bricolage Grotesque font with `variable: '--font-bricolage'`, applied as `.variable` class

## Tailwind v3 Notes
- Package uses **Tailwind CSS v3** (not v4) — avoid v4-only syntax
- `h-13` does not exist in v3 default scale; use `h-[52px]` for 52px height
- Opacity modifiers like `border-poker-green/30` work with hex colors in v3
- Custom colors in `tailwind.config.ts` under `theme.extend.colors.poker`

## TypeScript Strict Mode Gotchas
- `exactOptionalPropertyTypes: true` — avoid `.filter(Boolean)` on mixed arrays; build string[] explicitly
- `noUnusedLocals` and `noUnusedParameters` are on — clean up everything
- JSX `prop={undefined}` is treated as omitting the prop (safe for optional framer-motion props)
- `CSSProperties` is NOT assignable to `MotionStyle` — cast with `style as MotionStyle` when bridging

## Framer Motion Patterns
- Define animation variants/objects OUTSIDE components (never in render)
- For conditional transitions, use `{...(condition ? { transition: t } : {})}` spread pattern
  instead of `transition={condition ? t : undefined}` to stay safe with exactOptionalPropertyTypes
- `motion(BaseButton)` wraps BaseUI Button — framer handles style internally, no MotionStyle conflict
- Keyframe arrays `[1, 1.2, 1]` work in the `animate` prop as `TargetAndTransition`

## BaseUI Integration Notes
- Import path: `@base-ui-components/react/button` (NOT `@base-ui/react/button`)
- `motion(BaseButton)` creates `MotionButton` — accepts `BaseUI ButtonProps & MotionProps`
- Pass `nativeButton` prop on MotionButton to get native `<button>` semantics (type, name, value etc.)
- BaseUI wraps event handlers with `WithBaseUIEvent<...>` — standard `MouseEventHandler` is assignable
- Define explicit `ButtonProps` interface (NOT `extends ComponentPropsWithoutRef<'button'>`) to avoid
  type conflicts with BaseUI's wrapped event handler types

## Button Component Notes
- Variants: `primary | secondary | ghost | danger` (no `outline` variant)
- BaseUI + motion() pattern: `const MotionButton = motion(BaseButton)` at module level
- Default `type="button"` via `type ?? 'button'` to avoid accidental form submission
- Animation objects (`tapAnimation`, `springTransition`) defined as `const` outside component

## Shared UI Components Built
- `shared/components/ui/button/button.tsx` — motion(BaseButton) with variants/sizes/loading
- `shared/components/ui/input/input.tsx` — accessible input with label/error/hint
- `shared/components/ui/status-dot/status-dot.tsx` — animated presence indicator
- `shared/components/ui/badge/badge.tsx` — host/vote-count/status variants
- `shared/components/ui/timer-ring/timer-ring.tsx` — SVG countdown ring with color thresholds
