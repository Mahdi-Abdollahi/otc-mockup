import { useState } from "react";
import { useQuoteFlow } from "./useQuoteFlow";
import { QuoteAction, QuoteStatus, type CurrencyCode } from "./types";
import { CurrencyInput } from "./components/CurrencyInput";
import { QuoteCountdown } from "./components/QuoteCountdown";
import { ConfirmButton } from "./components/ConfirmButton";
import { ResultPanel } from "./components/ResultPanel";

export function OtcConverter() {
  const { state, dispatch } = useQuoteFlow();

  // Local, pre-submission form state — NOT part of the state machine,
  // since nothing here is "in flight" yet. This is deliberate: the
  // reducer only ever needs to know about a request AFTER submission.
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("USDT");
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("AED");

  const handleSubmit = () => {
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) return; // guard invalid input, no dispatch
    dispatch({
      type: QuoteAction.AMOUNT_SUBMITTED,
      payload: { request: { amount: parsed, fromCurrency, toCurrency } },
    });
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleReset = () => {
    dispatch({ type: QuoteAction.RESET });
    setAmount("");
  };

  return (
    <div className="mx-auto max-w-sm space-y-4 p-6">
      <h1 className="text-lg font-semibold">Convert</h1>

      {(state.status === QuoteStatus.IDLE ||
        state.status === QuoteStatus.QUOTING) && (
        <>
          <CurrencyInput
            amount={amount}
            onAmountChange={setAmount}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            onSwap={handleSwap}
            disabled={state.status === QuoteStatus.QUOTING}
          />
          <ConfirmButton
            onClick={handleSubmit}
            loading={state.status === QuoteStatus.QUOTING}
            disabled={!amount}
          />
        </>
      )}

      {state.status === QuoteStatus.QUOTED && (
        <div className="space-y-3">
          <p className="text-sm">
            {state.request.amount} {state.request.fromCurrency} →{" "}
            {(state.request.amount * state.response.rate).toFixed(2)}{" "}
            {state.request.toCurrency}
          </p>
          <QuoteCountdown
            expiresAt={state.response.expiresAt}
            onExpire={() => dispatch({ type: QuoteAction.QUOTE_EXPIRED })}
          />
          <ConfirmButton
            onClick={() => dispatch({ type: QuoteAction.CONFIRM_CLICKED })}
          />
        </div>
      )}

      {state.status === QuoteStatus.CONFIRMING && (
        <ConfirmButton onClick={() => {}} disabled loading />
      )}

      {state.status === QuoteStatus.SUCCESS && (
        <ResultPanel
          status="success"
          request={state.request}
          response={state.response}
          onReset={handleReset}
        />
      )}

      {state.status === QuoteStatus.FAILED && (
        <ResultPanel
          status="failed"
          reason={state.reason}
          onReset={handleReset}
        />
      )}

      {state.status === QuoteStatus.EXPIRED && (
        <ResultPanel status="expired" onReset={handleReset} />
      )}
    </div>
  );
}
