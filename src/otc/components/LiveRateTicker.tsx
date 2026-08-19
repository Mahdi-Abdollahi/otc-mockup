import { useLiveRate } from "../useLiveRate";

export function LiveRateTicker() {
  const { rate, connected } = useLiveRate();

  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>1 USDT ≈ {rate ? rate.toFixed(4) : "—"} AED</span>
      <span
        className={connected ? "text-emerald-500" : "text-muted-foreground"}
      >
        {connected ? "● live" : "○ connecting…"}
      </span>
    </div>
  );
}
