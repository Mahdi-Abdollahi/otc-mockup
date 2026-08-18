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
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          disabled={disabled}
          className="flex-1"
        />
        <span className="w-16 text-sm font-medium">{fromCurrency}</span>
      </div>

      <button
        type="button"
        onClick={onSwap}
        disabled={disabled}
        className="self-center text-xs text-muted-foreground hover:text-foreground"
        aria-label="Swap currencies"
      >
        ⇅ swap
      </button>

      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-md border px-3 py-2 text-sm text-muted-foreground">
          {/* Receive amount is derived from the quote once one exists — left blank here */}
        </div>
        <span className="w-16 text-sm font-medium">{toCurrency}</span>
      </div>
    </div>
  );
}
