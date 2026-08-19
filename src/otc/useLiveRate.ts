import { AED_USD_PEG, POLL_INTERVAL_MS } from "./rate";
import { useEffect, useState } from "react";

type LiveRateState = {
  rate: number | null;
  connected: boolean;
};

export function useLiveRate(): LiveRateState {
  const [rate, setRate] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function poll() {
      try {
        const res = await fetch(
          "https://api.binance.com/api/v3/ticker/price?symbol=USDCUSDT",
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("Rate fetch failed");
        const data = await res.json();
        const usdcUsdt = parseFloat(data.price);
        if (!cancelled) {
          setRate((1 / usdcUsdt) * AED_USD_PEG);
          setConnected(true);
        }
      } catch (error) {
        console.error("error", error);
        if (!cancelled) setConnected(false);
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return { rate, connected };
}
