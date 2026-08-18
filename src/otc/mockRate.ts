import type { QuoteRequest, QuoteResponse } from "./types";

export function fetchQuote(
  request: QuoteRequest,
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

  if (request.fromCurrency !== "USDT" && request.toCurrency !== "AED") {
    return Promise.reject(new Error("Invalid currency pair"));
  }

  const expiresAt = Date.now() + 1000 * 15;

  const baseRate = request.fromCurrency === "USDT" ? 3.67 : 1 / 3.67;
  const rate = baseRate + (Math.random() - 0.5) * 0.02;

  const orderId = crypto.randomUUID();

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (Math.random() < 0.1) {
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
