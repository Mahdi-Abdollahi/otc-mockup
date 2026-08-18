import type { QuoteRequest, QuoteResponse } from "../types";

type ResultPanelProps =
  | {
      status: "success";
      request: QuoteRequest;
      response: QuoteResponse;
      onReset: () => void;
    }
  | { status: "failed"; reason: string; onReset: () => void }
  | { status: "expired"; onReset: () => void };

export function ResultPanel(props: ResultPanelProps) {
  if (props.status === "success") {
    const { request, response } = props;
    return (
      <div className="rounded-md border border-green-500/30 bg-green-500/10 p-4">
        <p className="font-medium text-green-700">Trade completed</p>
        <p className="text-sm text-muted-foreground">
          {request.amount} {request.fromCurrency} → {request.toCurrency} at rate{" "}
          {response.rate.toFixed(4)}
        </p>
        <button onClick={props.onReset} className="mt-3 text-sm underline">
          Start a new conversion
        </button>
      </div>
    );
  }

  if (props.status === "failed") {
    return (
      <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4">
        <p className="font-medium text-red-700">Trade failed</p>
        <p className="text-sm text-muted-foreground">{props.reason}</p>
        <button onClick={props.onReset} className="mt-3 text-sm underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-4">
      <p className="font-medium text-yellow-700">Quote expired</p>
      <p className="text-sm text-muted-foreground">
        The price is no longer valid.
      </p>
      <button onClick={props.onReset} className="mt-3 text-sm underline">
        Get a new quote
      </button>
    </div>
  );
}
