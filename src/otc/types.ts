export const QuoteStatus = {
  IDLE: "IDLE",
  QUOTING: "QUOTING",
  QUOTED: "QUOTED",
  EXPIRED: "EXPIRED",
  CONFIRMING: "CONFIRMING",
  FAILED: "FAILED",
  SUCCESS: "SUCCESS",
} as const;

export type CurrencyCode = "USDT" | "AED";

export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus];

export type QuoteRequest = {
  amount: number;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
};

export type QuoteResponse = {
  orderId: string;
  rate: number;
  expiresAt: number;
};

export type QuoteIdleState = {
  status: typeof QuoteStatus.IDLE;
};

export type QuoteQuotingState = {
  status: typeof QuoteStatus.QUOTING;
  request: QuoteRequest;
  referenceRate: number;
};

export type QuoteQuotedState = {
  status: typeof QuoteStatus.QUOTED;
  request: QuoteRequest;
  response: QuoteResponse;
};

export type QuoteConfirmingState = {
  status: typeof QuoteStatus.CONFIRMING;
  request: QuoteRequest;
  response: QuoteResponse;
};

export type QuoteExpiredState = {
  status: typeof QuoteStatus.EXPIRED;
  request: QuoteRequest;
  response: QuoteResponse;
};

export type QuoteFailedState = {
  status: typeof QuoteStatus.FAILED;
  request?: QuoteRequest;
  response?: QuoteResponse;
  reason: string;
};

export type QuoteSuccessState = {
  status: typeof QuoteStatus.SUCCESS;
  request: QuoteRequest;
  response: QuoteResponse;
};

export type QuoteState =
  | QuoteIdleState
  | QuoteQuotingState
  | QuoteQuotedState
  | QuoteConfirmingState
  | QuoteExpiredState
  | QuoteFailedState
  | QuoteSuccessState;

export type QuoteActionPayload =
  | {
      type: "AMOUNT_SUBMITTED";
      payload: { request: QuoteRequest; referenceRate: number };
    }
  | { type: "QUOTE_RECEIVED"; payload: { response: QuoteResponse } }
  | { type: "QUOTE_EXPIRED" }
  | { type: "CONFIRM_CLICKED" }
  | { type: "ORDER_SUCCEEDED" }
  | { type: "ORDER_FAILED"; payload: { reason: string } }
  | { type: "RESET" }
  | { type: "CANCEL" };

export const QuoteAction = {
  AMOUNT_SUBMITTED: "AMOUNT_SUBMITTED",
  QUOTE_RECEIVED: "QUOTE_RECEIVED",
  QUOTE_EXPIRED: "QUOTE_EXPIRED",
  CONFIRM_CLICKED: "CONFIRM_CLICKED",
  ORDER_SUCCEEDED: "ORDER_SUCCEEDED",
  ORDER_FAILED: "ORDER_FAILED",
  RESET: "RESET",
  CANCEL: "CANCEL",
} as const;

export type QuoteAction = (typeof QuoteAction)[keyof typeof QuoteAction];
