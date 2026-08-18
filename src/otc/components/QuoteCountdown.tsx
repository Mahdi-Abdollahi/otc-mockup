import { useEffect, useState } from "react";

type QuoteCountdownProps = {
  expiresAt: number;
  onExpire: () => void;
};

export function QuoteCountdown({ expiresAt, onExpire }: QuoteCountdownProps) {
  const [remainingMs, setRemainingMs] = useState(() => expiresAt - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const next = expiresAt - Date.now();
      setRemainingMs(next);
      if (next <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const secondsLeft = Math.max(0, Math.ceil(remainingMs / 1000));

  return (
    <span className="text-sm text-muted-foreground tabular-nums">
      {secondsLeft}s
    </span>
  );
}
