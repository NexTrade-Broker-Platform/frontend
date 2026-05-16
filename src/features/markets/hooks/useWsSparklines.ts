import { useEffect, useRef, useState } from "react";
import { useNotifications } from "@/providers/NotificationProvider";
import type { SparklinePoint } from "@/features/markets/views/components/StockSparkline";

const MAX_POINTS = 40;

export function useWsSparklines(): Record<string, SparklinePoint[]> {
  const { priceUpdates } = useNotifications();
  const buffers = useRef<Record<string, number[]>>({});
  const [points, setPoints] = useState<Record<string, SparklinePoint[]>>({});

  // Accumulate raw prices on every WS tick — no render triggered
  useEffect(() => {
    for (const [ticker, update] of Object.entries(priceUpdates)) {
      const buf = buffers.current[ticker] ?? [];
      if (buf[buf.length - 1] !== update.price) {
        buffers.current[ticker] = [...buf, update.price].slice(-MAX_POINTS);
      }
    }
  }, [priceUpdates]);

  // Flush to state every 2 seconds — only replace arrays that actually changed
  useEffect(() => {
    const id = setInterval(() => {
      setPoints((prev) => {
        let changed = false;
        const next: Record<string, SparklinePoint[]> = { ...prev };
        for (const [ticker, buf] of Object.entries(buffers.current)) {
          const prevArr = prev[ticker];
          const lastVal = prevArr?.[prevArr.length - 1]?.value;
          if (!prevArr || prevArr.length !== buf.length || lastVal !== buf[buf.length - 1]) {
            next[ticker] = buf.map((v) => ({ value: v }));
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return points;
}
