import { Input } from "@/components/ui/input";
import type { CurrencyCode } from "../types";

type CurrencyInputProps = {
  amount: string;
  onAmountChange: (value: string) => void;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  onSwap: () => void;
  disabled?: boolean;
};

export function CurrencyInput({
  amount,
  onAmountChange,
  fromCurrency,
  toCurrency,
  onSwap,
  disabled,
}: CurrencyInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
        <Input
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          disabled={disabled}
          className="font-figures border-0 bg-transparent p-0 text-lg shadow-none focus-visible:ring-0"
        />
        <span className="text-sm font-medium text-muted-foreground">
          {fromCurrency}
        </span>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onSwap}
          disabled={disabled}
          aria-label="Swap currencies"
          className="rounded-full border bg-background p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40"
        >
          ⇅
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-md border bg-muted/10 px-3 py-2 text-muted-foreground">
        <span className="font-figures flex-1 text-lg">—</span>
        <span className="text-sm font-medium">{toCurrency}</span>
      </div>
    </div>
  );
}
