import { useEffect, useReducer } from "react";
import { QuoteAction, QuoteStatus, type QuoteState } from "./types";
import { quoteReducer } from "./reducer";
import { fetchQuote, submitOrder } from "./mockRate";

const initialState: QuoteState = { status: QuoteStatus.IDLE };

export function useQuoteFlow() {
  const [state, dispatch] = useReducer(quoteReducer, initialState);

  useEffect(() => {
    if (state.status !== QuoteStatus.QUOTING) return;

    const controller = new AbortController();

    fetchQuote(state.request, controller.signal)
      .then((quote) => {
        dispatch({
          type: QuoteAction.QUOTE_RECEIVED,
          payload: { response: quote },
        });
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        const message =
          error instanceof Error ? error.message : "Unknown error";
        dispatch({
          type: QuoteAction.ORDER_FAILED,
          payload: { reason: message },
        });
      });

    return () => controller.abort();
  }, [state.status]);

  useEffect(() => {
    if (state.status !== QuoteStatus.CONFIRMING) return;

    const controller = new AbortController();

    submitOrder(state.request, state.response, controller.signal)
      .then(() => {
        dispatch({ type: QuoteAction.ORDER_SUCCEEDED });
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        const message =
          error instanceof Error ? error.message : "Unknown error";
        dispatch({
          type: QuoteAction.ORDER_FAILED,
          payload: { reason: message },
        });
      });

    return () => controller.abort();
  }, [state.status]);

  return { state, dispatch };
}
