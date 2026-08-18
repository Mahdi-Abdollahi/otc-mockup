// reducer.ts

import { QuoteStatus, type QuoteActionPayload, type QuoteState } from "./types";

export function quoteReducer(
  state: QuoteState,
  action: QuoteActionPayload,
): QuoteState {
  switch (action.type) {
    case "AMOUNT_SUBMITTED":
      if (state.status !== QuoteStatus.IDLE) return state;
      return { status: QuoteStatus.QUOTING, request: action.payload.request };

    case "QUOTE_RECEIVED":
      if (state.status !== QuoteStatus.QUOTING) return state;
      return {
        ...state,
        status: QuoteStatus.QUOTED,
        response: action.payload.response,
      };

    case "QUOTE_EXPIRED":
      if (state.status !== QuoteStatus.QUOTED) return state;
      return {
        ...state,
        status: QuoteStatus.EXPIRED,
      };

    case "CONFIRM_CLICKED":
      if (state.status !== QuoteStatus.QUOTED) return state;
      return {
        ...state,
        status: QuoteStatus.CONFIRMING,
      };

    case "ORDER_SUCCEEDED":
      if (state.status !== QuoteStatus.CONFIRMING) return state;
      return {
        ...state,
        status: QuoteStatus.SUCCESS,
      };

    case "ORDER_FAILED":
      if (
        state.status !== QuoteStatus.QUOTING &&
        state.status !== QuoteStatus.CONFIRMING
      ) {
        return state;
      }
      return {
        ...state,
        status: QuoteStatus.FAILED,
        reason: action.payload.reason,
      };

    case "RESET":
      return { status: QuoteStatus.IDLE };

    case "CANCEL":
      console.log("CANCEL ACTION");
      if (
        state.status === QuoteStatus.CONFIRMING ||
        state.status === QuoteStatus.QUOTED
      ) {
        return {
          ...state,
          status: QuoteStatus.IDLE,
        };
      }
      return state;

    default:
      return state;
  }
}
