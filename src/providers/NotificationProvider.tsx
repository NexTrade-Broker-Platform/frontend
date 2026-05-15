import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ReactNode } from 'react';

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

const WS_BASE: string =
  (import.meta.env.VITE_NOTIFICATION_WS_URL as string | undefined) ?? 'ws://localhost:9006';

const RETRY_BASE_MS = 1_000;
const RETRY_MAX_MS = 30_000;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [priceUpdates, setPriceUpdates] = useState<Record<string, PriceUpdate>>({});
  const [marketEvents, setMarketEvents] = useState<MarketEvent[]>([]);
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(true);
  const retryDelayRef = useRef(RETRY_BASE_MS);

  useEffect(() => {
    activeRef.current = true;
    retryDelayRef.current = RETRY_BASE_MS;

    function scheduleReconnect() {
      if (!activeRef.current) return;
      timerRef.current = setTimeout(connect, retryDelayRef.current);
      retryDelayRef.current = Math.min(retryDelayRef.current * 2, RETRY_MAX_MS);
    }

    function connect() {
      if (!activeRef.current) return;
      const token = localStorage.getItem('jwt_token');
      let url = WS_BASE + '/ws/notifications';
      if (token) {
        url += `?token=${encodeURIComponent(token)}`;
      }

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        retryDelayRef.current = RETRY_BASE_MS;
      };

      ws.onmessage = ({ data }) => {
        try {
          const msg = JSON.parse(data as string) as { type: string; payload: unknown };
          switch (msg.type) {
            case 'PRICE_UPDATE': {
              const p = msg.payload as PriceUpdate;
              setPriceUpdates((prev) => ({ ...prev, [p.ticker]: p }));
              break;
            }
            case 'ORDER_UPDATE': {
              const o = msg.payload as { order_id: string; status: string };
              queryClient.invalidateQueries({ queryKey: ['orders'] });
              queryClient.invalidateQueries({ queryKey: ['portfolio'] });
              queryClient.invalidateQueries({ queryKey: ['wallet'] });
              toast.info(`Order ${o.order_id} → ${o.status}`);
              break;
            }
            case 'MARKET_EVENT': {
              const e = msg.payload as MarketEvent;
              setMarketEvents((prev) => [e, ...prev].slice(0, 50));
              break;
            }
          }
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => scheduleReconnect();
      ws.onerror = () => ws.close();
    }

    function handleVisibilityChange() {
      if (document.hidden) return;
      const state = wsRef.current?.readyState;
      if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      retryDelayRef.current = RETRY_BASE_MS;
      connect();
    }

    connect();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      activeRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      wsRef.current?.close();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
