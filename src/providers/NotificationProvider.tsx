import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ReactNode } from 'react';
import { wsClient } from '@/shared/lib/ws/wsClient';
import type { Candle } from '@/features/markets/types/markets';

export interface PriceUpdate {
  ticker: string;
  price: number;
  change: number;
  change_pct: number;
  volume: number;
  market_time: string;
}

export interface MarketEvent {
  event_id: string;
  event_type: string;
  headline: string;
  scope: string;
  target: string;
  magnitude: number;
  duration_ticks: number;
  market_time: string;
}

interface NotificationContextValue {
  priceUpdates: Record<string, PriceUpdate>;
  marketEvents: MarketEvent[];
}

const NotificationContext = createContext<NotificationContextValue>({
  priceUpdates: {},
  marketEvents: [],
});

// --------------------------------------------------------------------------- //
// Module-level price history — persists across component mount/unmount cycles  //
// so chart data survives page navigation.                                       //
// --------------------------------------------------------------------------- //

interface PriceTick { time: number; price: number }

const _priceHistory = new Map<string, PriceTick[]>();
const PRICE_HISTORY_MAX = 2000;
const CANDLE_BUCKET_SECS = 10; // 10 real-seconds per candle (≈10 sim-minutes at 60× speed)

export function getPriceHistoryCandles(ticker: string): Candle[] {
  const ticks = _priceHistory.get(ticker);
  if (!ticks || ticks.length === 0) return [];

  const buckets = new Map<number, { open: number; high: number; low: number; close: number }>();
  for (const tick of ticks) {
    const t = Math.floor(tick.time / CANDLE_BUCKET_SECS) * CANDLE_BUCKET_SECS;
    const b = buckets.get(t);
    if (!b) {
      buckets.set(t, { open: tick.price, high: tick.price, low: tick.price, close: tick.price });
    } else {
      if (tick.price > b.high) b.high = tick.price;
      if (tick.price < b.low)  b.low  = tick.price;
      b.close = tick.price;
    }
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([time, o]) => ({ time, open: o.open, high: o.high, low: o.low, close: o.close, volume: 0 }));
}

// --------------------------------------------------------------------------- //

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [priceUpdates, setPriceUpdates] = useState<Record<string, PriceUpdate>>({});
  const [marketEvents, setMarketEvents] = useState<MarketEvent[]>([]);
  const queryClient = useQueryClient();
  const invalidateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Batch all price ticks that arrive in the same animation frame into one setState,
  // reducing re-renders from 37/tick to 1/tick and preventing the OOM tab crash.
  const priceBatchRef = useRef<Record<string, PriceUpdate>>({});
  const priceBatchRafRef = useRef<number | null>(null);

  useEffect(() => {
    function onPrice(payload: unknown) {
      const p = payload as PriceUpdate;
      priceBatchRef.current[p.ticker] = p;

      // Accumulate into module-level history for the chart
      if (!_priceHistory.has(p.ticker)) _priceHistory.set(p.ticker, []);
      const arr = _priceHistory.get(p.ticker)!;
      arr.push({ time: Math.floor(Date.now() / 1000), price: p.price });
      if (arr.length > PRICE_HISTORY_MAX) arr.splice(0, arr.length - PRICE_HISTORY_MAX);

      if (!priceBatchRafRef.current) {
        priceBatchRafRef.current = requestAnimationFrame(() => {
          const batch = priceBatchRef.current;
          priceBatchRef.current = {};
          priceBatchRafRef.current = null;
          setPriceUpdates((prev) => ({ ...prev, ...batch }));
        });
      }
    }

    function onOrder(payload: unknown) {
      const o = payload as { order_id: string; status: string };
      // Debounce invalidations — bot generates dozens of updates per minute;
      // firing 3 refetches per update causes memory pressure and tab crashes.
      if (!invalidateTimerRef.current) {
        invalidateTimerRef.current = setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['portfolio'] });
          queryClient.invalidateQueries({ queryKey: ['wallet'] });
          invalidateTimerRef.current = null;
        }, 1_000);
      }
      // Only toast terminal states for manually placed orders — suppress
      // PENDING/PARTIALLY_FILLED chatter that the bot generates constantly.
      if (o.status === "FILLED" || o.status === "REJECTED") {
        toast.info(`Order ${o.order_id.slice(0, 8)} → ${o.status}`);
      }
    }

    function onMarketEvent(payload: unknown) {
      const e = payload as MarketEvent;
      setMarketEvents((prev) => [e, ...prev].slice(0, 50));
    }

    wsClient.subscribe('PRICE_UPDATE', onPrice);
    wsClient.subscribe('ORDER_UPDATE', onOrder);
    wsClient.subscribe('MARKET_EVENT', onMarketEvent);
    wsClient.start();

    return () => {
      wsClient.unsubscribe('PRICE_UPDATE', onPrice);
      wsClient.unsubscribe('ORDER_UPDATE', onOrder);
      wsClient.unsubscribe('MARKET_EVENT', onMarketEvent);
      if (invalidateTimerRef.current) clearTimeout(invalidateTimerRef.current);
      if (priceBatchRafRef.current) cancelAnimationFrame(priceBatchRafRef.current);
      wsClient.stop();
    };
  }, [queryClient]);

  return (
    <NotificationContext.Provider value={{ priceUpdates, marketEvents }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}

export function useLivePrice(ticker: string): PriceUpdate | undefined {
  const { priceUpdates } = useNotifications();
  return priceUpdates[ticker];
}
