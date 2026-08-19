import { describe, it, expect } from "vitest";
import { quoteReducer } from "./reducer";
import {
  QuoteStatus,
  type QuoteState,
  QuoteAction,
  type QuoteQuotedState,
  type QuoteConfirmingState,
} from "./types";

describe("quoteReducer", () => {
  it("transitions from IDLE to QUOTING on AMOUNT_SUBMITTED", () => {
    const initial: QuoteState = { status: QuoteStatus.IDLE };
    const result = quoteReducer(initial, {
      type: QuoteAction.AMOUNT_SUBMITTED,
      payload: {
        request: { amount: 100, fromCurrency: "USDT", toCurrency: "AED" },
        referenceRate: 3.6,
      },
    });
    expect(result.status).toBe(QuoteStatus.QUOTING);
  });

  it("transitions from QUOTING to QUOTED on QUOTE_RECEIVED", () => {
    const quotingState: QuoteState = {
      status: QuoteStatus.QUOTING,
      request: { amount: 1000, fromCurrency: "USDT", toCurrency: "AED" },
      referenceRate: 3.6,
    };
    const result = quoteReducer(quotingState, {
      type: QuoteAction.QUOTE_RECEIVED,
      payload: {
        response: {
          expiresAt: Date.now() + 15000,
          orderId: "123",
          rate: 3.67,
        },
      },
    }) as QuoteQuotedState;

    expect(result.status).toBe(QuoteStatus.QUOTED);
    expect(result.request).toEqual(quotingState.request);
  });

  it("transitions from QUOTED to CONFIRMING on CONFIRM_CLICKED", () => {
    const quotedState: QuoteState = {
      status: QuoteStatus.QUOTED,
      request: { amount: 1000, fromCurrency: "USDT", toCurrency: "AED" },
      response: { expiresAt: Date.now() + 15000, orderId: "123", rate: 3.67 },
    };
    const result = quoteReducer(quotedState, {
      type: QuoteAction.CONFIRM_CLICKED,
    }) as QuoteConfirmingState;

    expect(result.status).toBe(QuoteStatus.CONFIRMING);
  });

  it("ignores CONFIRM_CLICKED when state is IDLE", () => {
    const idleState: QuoteState = { status: QuoteStatus.IDLE };
    const result = quoteReducer(idleState, {
      type: QuoteAction.CONFIRM_CLICKED,
    });
    expect(result).toEqual(idleState);
  });

  it("ignores CONFIRM_CLICKED when state is QUOTING", () => {
    const quotingState: QuoteState = {
      status: QuoteStatus.QUOTING,
      request: { amount: 1000, fromCurrency: "USDT", toCurrency: "AED" },
      referenceRate: 3.6,
    };
    const result = quoteReducer(quotingState, {
      type: QuoteAction.CONFIRM_CLICKED,
    });
    expect(result).toEqual(quotingState);
  });

  it("ignores ORDER_SUCCEEDED when state is QUOTED (not yet CONFIRMING)", () => {
    const quotedState: QuoteState = {
      status: QuoteStatus.QUOTED,
      request: { amount: 1000, fromCurrency: "USDT", toCurrency: "AED" },
      response: { expiresAt: Date.now() + 15000, orderId: "123", rate: 3.67 },
    };
    const result = quoteReducer(quotedState, {
      type: QuoteAction.ORDER_SUCCEEDED,
    });
    expect(result).toEqual(quotedState);
  });

  it("transitions from CONFIRMING to SUCCESS on ORDER_SUCCEEDED", () => {
    const confirmingState: QuoteState = {
      status: QuoteStatus.CONFIRMING,
      request: { amount: 1000, fromCurrency: "USDT", toCurrency: "AED" },
      response: { expiresAt: Date.now() + 15000, orderId: "123", rate: 3.67 },
    };
    const result = quoteReducer(confirmingState, {
      type: QuoteAction.ORDER_SUCCEEDED,
    });
    expect(result.status).toBe(QuoteStatus.SUCCESS);
  });

  it("transitions from QUOTED to EXPIRED on QUOTE_EXPIRED", () => {
    const quotedState: QuoteState = {
      status: QuoteStatus.QUOTED,
      request: { amount: 1000, fromCurrency: "USDT", toCurrency: "AED" },
      response: { expiresAt: Date.now() + 15000, orderId: "123", rate: 3.67 },
    };
    const result = quoteReducer(quotedState, {
      type: QuoteAction.QUOTE_EXPIRED,
    });
    expect(result.status).toBe(QuoteStatus.EXPIRED);
  });

  it("RESET always returns to IDLE, from any state", () => {
    const successState: QuoteState = {
      status: QuoteStatus.SUCCESS,
      request: { amount: 1000, fromCurrency: "USDT", toCurrency: "AED" },
      response: { expiresAt: Date.now() + 15000, orderId: "123", rate: 3.67 },
    };
    const result = quoteReducer(successState, { type: QuoteAction.RESET });
    expect(result).toEqual({ status: QuoteStatus.IDLE });
  });
});
