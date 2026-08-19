# OTC Conversion Flow — Frontend Mockup

A small, focused frontend implementation of an OTC-style crypto ⇄ fiat conversion flow (USDT ⇄ AED), built as a technical demo exploring state management, async UX, and testing practices for financial/trading-style interfaces.

**[Live demo →](https://mahdi-abdollahi.github.io/otc-mockup/)**

## Why this exists

OTC (over-the-counter) trading products differ from typical order-book exchanges — instead of a public market, the platform gives the user a single, time-limited quote to accept or decline. I wanted to build this specific interaction pattern properly: correct state modeling, real edge-case handling (expiry, cancellation, failure), and genuine test coverage — rather than a broad but shallow feature set.

## What it does

1. Shows a live reference rate (via a real Binance market data feed, used as a USDT/USD proxy, combined with AED's fixed USD peg)
2. Lets the user enter an amount and see a live-updating estimate
3. On confirm, requests a locked quote (valid for 15 seconds, countdown shown)
4. User can confirm before expiry, or the quote expires and must be re-requested
5. On confirm, the order is submitted and settles to success or failure

## Why a state machine

OTC pricing carries real financial risk if handled carelessly on the frontend — a stale quote must never be honorable after it expires, and a settlement in progress must never be double-submitted. Rather than tracking this with ad-hoc booleans (`isLoading`, `isExpired`, `hasError`...), the whole flow is modeled as an explicit state machine (`IDLE → QUOTING → QUOTED → CONFIRMING → SUCCESS | FAILED`, plus `EXPIRED` and `CANCEL` branches), implemented as a TypeScript discriminated union + reducer. This makes impossible states (e.g. confirming a trade with no quote) unrepresentable at the type level, and every transition is unit tested.

## Scope decisions

Deliberately **not** built, and why:

- **No backend / real settlement** — the quote and settlement logic is mocked, since a real trading backend is out of scope for a frontend demo. The mock is fed by a real live market rate, so only the "packaging" (order IDs, locking, spread) is simulated, not the underlying price data.
- **No multi-currency support** — one pair only (USDT ⇄ AED), to keep the interaction pattern the focus rather than building a generic exchange UI.
- **No authentication/KYC screens** — out of scope for demonstrating the core conversion mechanic.

## Tech stack

- **Vite + React + TypeScript** — no routing/SSR needed for a single-screen tool
- **Tailwind + shadcn/ui** — dark theme, monospace figures for numeric values (a deliberate nod to trading-UI convention: aligned digits, no visual jitter)
- **Vitest** — 9 unit tests covering every reducer transition, including guarded invalid transitions
- **Playwright** — end-to-end tests across Chromium, Firefox, and WebKit, covering the full success path and the expiry path, with the mock's random failure rate suppressed via an env var for deterministic runs

## Running locally

```bash
pnpm install
pnpm dev
```

## Running tests

```bash
pnpm test              # unit tests (Vitest)
npx playwright test    # end-to-end tests
```

## What I'd build next

- Replace the mocked quote/settlement layer with a real backend once one exists
- Multi-currency pair support, once the core single-pair flow has been validated with real usage
- Reimplement state management with Zustand/RTK as a comparison exercise (the current `useReducer` approach is sufficient for one component's local state, so this would be exploratory, not a fix for a real limitation)
