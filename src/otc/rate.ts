import type { CurrencyCode } from "./types";

export const POLL_INTERVAL_MS = 3000;
export const AED_USD_PEG = 3.6725; // AED is currency-board-pegged to USD

const SPREAD_PCT = 0.003; // fixed margin — deterministic, not random

export function computeConvertedRate(
  referenceRate: number,
  fromCurrency: CurrencyCode,
): number {
  const base = fromCurrency === "USDT" ? referenceRate : 1 / referenceRate;
  return base * (1 - SPREAD_PCT);
}
