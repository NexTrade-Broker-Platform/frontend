import { createContext, useContext, useEffect, useState } from 'react';
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

  useEffect(() => {
    function onPrice(payload: unknown) {
      const p = payload as PriceUpdate;
      setPriceUpdates((prev) => ({ ...prev, [p.ticker]: p }));

      // Accumulate into module-level history for the chart
      if (!_priceHistory.has(p.ticker)) _priceHistory.set(p.ticker, []);
      const arr = _priceHistory.get(p.ticker)!;
      arr.push({ time: Math.floor(Date.now() / 1000), price: p.price });
      if (arr.length > PRICE_HISTORY_MAX) arr.splice(0, arr.length - PRICE_HISTORY_MAX);
    }

    function onOrder(payload: unknown) {
      const o = payload as { order_id: string; status: string };
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.info(`Order ${o.order_id} → ${o.status}`);
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
