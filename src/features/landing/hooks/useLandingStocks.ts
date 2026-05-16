import { useNotifications } from "@/providers/NotificationProvider";

export function useLandingStocks() {
  const { priceUpdates } = useNotifications();
  const tickers = Object.keys(priceUpdates).slice(0, 3);

  return {
    tickers,
    isLoading: tickers.length === 0,
  };
}
