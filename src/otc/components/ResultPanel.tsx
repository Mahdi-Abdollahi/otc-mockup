import type { QuoteRequest, QuoteResponse } from "../types";
import { Button } from "@/components/ui/button";

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
      <div className="space-y-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4">
        <p className="font-medium text-emerald-500">Trade completed</p>
        <p className="font-figures text-sm text-muted-foreground">
          {request.amount} {request.fromCurrency} →{" "}
          {(request.amount * response.rate).toFixed(2)} {request.toCurrency}
        </p>
        <Button variant="outline" size="sm" onClick={props.onReset}>
          Start a new conversion
        </Button>
      </div>
    );
  }

  if (props.status === "failed") {
    return (
      <div className="space-y-3 rounded-md border border-destructive/30 bg-destructive/10 p-4">
        <p className="font-medium text-destructive">Trade failed</p>
        <p className="text-sm text-muted-foreground">{props.reason}</p>
        <Button variant="outline" size="sm" onClick={props.onReset}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-md border border-amber-500/30 bg-amber-500/10 p-4">
      <p className="font-medium text-amber-500">Quote expired</p>
      <p className="text-sm text-muted-foreground">
        The price is no longer valid.
      </p>
      <Button variant="outline" size="sm" onClick={props.onReset}>
        Get a new quote
      </Button>
    </div>
  );
}
