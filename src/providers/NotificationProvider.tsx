import { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ReactNode } from 'react';
import { wsClient } from '@/shared/lib/ws/wsClient';

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

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [priceUpdates, setPriceUpdates] = useState<Record<string, PriceUpdate>>({});
  const [marketEvents, setMarketEvents] = useState<MarketEvent[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    function onPrice(payload: unknown) {
      const p = payload as PriceUpdate;
      setPriceUpdates((prev) => ({ ...prev, [p.ticker]: p }));
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
