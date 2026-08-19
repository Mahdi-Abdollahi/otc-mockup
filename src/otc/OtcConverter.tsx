import { useState } from "react";
import { useQuoteFlow } from "./useQuoteFlow";
import { QuoteAction, QuoteStatus, type CurrencyCode } from "./types";
import { CurrencyInput } from "./components/CurrencyInput";
import { QuoteCountdown } from "./components/QuoteCountdown";
import { ConfirmButton } from "./components/ConfirmButton";
import { ResultPanel } from "./components/ResultPanel";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CancelButton } from "./components/CancelButton";
import { LiveRateTicker } from "./components/LiveRateTicker";
import { useLiveRate } from "./useLiveRate";
import { computeConvertedRate } from "./rate";

export function OtcConverter() {
  const { rate: liveRate } = useLiveRate();
  const { state, dispatch } = useQuoteFlow(); // no longer takes liveRate

  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("USDT");
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("AED");

  const estimatedAmount = (() => {
    const parsed = Number(amount);
    if (!parsed || parsed <= 0 || liveRate === null) return null;
    return parsed * computeConvertedRate(liveRate, fromCurrency);
  })();

  const handleSubmit = () => {
    const parsed = Number(amount);
    if (!parsed || parsed <= 0 || liveRate === null) return;
    dispatch({
      type: QuoteAction.AMOUNT_SUBMITTED,
      payload: {
        request: { amount: parsed, fromCurrency, toCurrency },
        referenceRate: liveRate, // captured once, locked from here on
      },
    });
  };

  const handleCancel = () => {
    console.log("handleCancel");
    dispatch({
      type: QuoteAction.CANCEL,
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
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Convert</CardTitle>
          <CardDescription>USDT ⇄ AED, instant OTC quote</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {(state.status === QuoteStatus.IDLE ||
            state.status === QuoteStatus.QUOTING) && (
            <div>
              <LiveRateTicker />
              <CurrencyInput
                amount={amount}
                onAmountChange={setAmount}
                fromCurrency={fromCurrency}
                toCurrency={toCurrency}
                onSwap={handleSwap}
                disabled={state.status === QuoteStatus.QUOTING}
                estimatedAmount={estimatedAmount}
              />
            </div>
          )}

          {state.status === QuoteStatus.QUOTED && (
            <div className="space-y-3">
              <div className="flex items-baseline justify-between rounded-md border bg-muted/40 px-4 py-3">
                <span className="font-figures text-lg">
                  {state.request.amount} {state.request.fromCurrency}
                </span>
                <span className="text-muted-foreground">→</span>
                <span
                  data-testid="quote-result"
                  className="font-figures text-lg"
                >
                  {(state.request.amount * state.response.rate).toFixed(2)}{" "}
                  {state.request.toCurrency}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Quote expires in</span>
                <QuoteCountdown
                  expiresAt={state.response.expiresAt}
                  onExpire={() => dispatch({ type: QuoteAction.QUOTE_EXPIRED })}
                />
              </div>
            </div>
          )}

          {state.status === QuoteStatus.CONFIRMING && (
            <p className="text-center text-sm text-muted-foreground">
              Settling your order…
            </p>
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
        </CardContent>

        {(state.status === QuoteStatus.IDLE ||
          state.status === QuoteStatus.QUOTING ||
          state.status === QuoteStatus.QUOTED ||
          state.status === QuoteStatus.CONFIRMING) && (
          <CardFooter>
            {state.status === QuoteStatus.QUOTED && (
              <div className="w-full flex flex-col gap-2">
                <ConfirmButton
                  onClick={() =>
                    dispatch({ type: QuoteAction.CONFIRM_CLICKED })
                  }
                />
                <CancelButton onClick={handleCancel} />
              </div>
            )}
            {(state.status === QuoteStatus.IDLE ||
              state.status === QuoteStatus.QUOTING) && (
              <ConfirmButton
                onClick={handleSubmit}
                loading={state.status === QuoteStatus.QUOTING}
                disabled={!amount}
              />
            )}
            {state.status === QuoteStatus.CONFIRMING && (
              <ConfirmButton onClick={() => {}} disabled loading />
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
