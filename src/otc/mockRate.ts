import { computeConvertedRate } from "./rate";
import type { QuoteRequest, QuoteResponse } from "./types";

const FAILURE_RATE = Number(import.meta.env.VITE_MOCK_FAILURE_RATE ?? 0.1);

export function fetchQuote(
  request: QuoteRequest,
  referenceRate: number,
  signal?: AbortSignal,
): Promise<QuoteResponse> {
  if (signal?.aborted) {
    return Promise.reject(new DOMException("Aborted", "AbortError"));
  }

  if (request.amount <= 0) {
    return Promise.reject(new Error("Amount must be greater than 0"));
  }
  if (request.fromCurrency === request.toCurrency) {
    return Promise.reject(
      new Error("From currency and to currency cannot be the same"),
    );
  }

  if (request.fromCurrency !== "USDT" && request.fromCurrency !== "AED") {
    return Promise.reject(new Error("Invalid currency pair"));
  }

  const rate = computeConvertedRate(referenceRate, request.fromCurrency);
  const orderId = crypto.randomUUID();
  const expiresAt = Date.now() + 15_000;

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (Math.random() < FAILURE_RATE) {
        reject(new Error("Quote failed"));
        return;
      }
      resolve({
        orderId,
        rate,
        expiresAt,
      });
    }, 800);

    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError")); // how real code distinguishes "cancelled on purpose" from "cancelled due to error"
      });
    }
  });
}

export function submitOrder(
  request: QuoteRequest,
  response: QuoteResponse,
  signal?: AbortSignal,
): Promise<void> {
  if (signal?.aborted) {
    return Promise.reject(new DOMException("Aborted", "AbortError"));
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (Math.random() < 0.1) {
        reject(new Error("Settlement failed. Please try again."));
        return;
      }
      resolve();
    }, 700);

    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError"));
      });
    }
  });
}
