export const QuoteStatus = {
  IDLE: "IDLE",
  QUOTING: "QUOTING",
  QUOTED: "QUOTED",
  EXPIRED: "EXPIRED",
  CONFIRMING: "CONFIRMING",
  FAILED: "FAILED",
  SUCCESS: "SUCCESS",
} as const;

export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus];

export type QuoteRequest = {
  amount: number;
  currency: string;
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
  request: QuoteRequest;
  response: QuoteResponse;
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

export type QuoteAction =
  | { type: "AMOUNT_SUBMITTED"; request: QuoteRequest }
  | { type: "QUOTE_RECEIVED"; response: QuoteResponse }
  | { type: "QUOTE_EXPIRED" }
  | { type: "CONFIRM_CLICKED" }
  | { type: "ORDER_SUCCEEDED" }
  | { type: "ORDER_FAILED"; reason: string }
  | { type: "RESET" };
