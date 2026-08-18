// reducer.ts

import { QuoteStatus, type QuoteAction, type QuoteState } from "./types";

export function quoteReducer(
  state: QuoteState,
  action: QuoteAction,
): QuoteState {
  switch (action.type) {
    case "AMOUNT_SUBMITTED":
      if (state.status !== QuoteStatus.IDLE) return state;
      return { status: QuoteStatus.QUOTING, request: action.request };

    case "QUOTE_RECEIVED":
      if (state.status !== QuoteStatus.QUOTING) return state;
      return {
        status: QuoteStatus.QUOTED,
        request: state.request,
        response: action.response,
      };

    case "QUOTE_EXPIRED":
      if (state.status !== QuoteStatus.QUOTED) return state;
      return {
        status: QuoteStatus.EXPIRED,
        request: state.request,
        response: state.response,
      };

    case "CONFIRM_CLICKED":
      if (state.status !== QuoteStatus.QUOTED) return state;
      return {
        status: QuoteStatus.CONFIRMING,
        request: state.request,
        response: state.response,
      };

    case "ORDER_SUCCEEDED":
      if (state.status !== QuoteStatus.CONFIRMING) return state;
      return {
        status: QuoteStatus.SUCCESS,
        request: state.request,
        response: state.response,
      };

    case "ORDER_FAILED":
      if (state.status !== QuoteStatus.CONFIRMING) return state;
      return {
        status: QuoteStatus.FAILED,
        request: state.request,
        response: state.response,
        reason: action.reason,
      };

    case "RESET":
      return { status: QuoteStatus.IDLE };

    default:
      return state;
  }
}
