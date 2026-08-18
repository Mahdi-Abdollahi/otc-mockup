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
  const isUrgent = secondsLeft <= 5;

  return (
    <span
      className={`font-figures text-sm font-medium ${
        isUrgent ? "text-amber-500" : "text-emerald-500"
      }`}
    >
      {secondsLeft}s
    </span>
  );
}
