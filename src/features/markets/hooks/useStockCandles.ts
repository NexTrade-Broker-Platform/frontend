import { useQuery } from "@tanstack/react-query";
import { marketsManager } from "@/features/markets/services/marketsManager";
import { getPriceHistoryCandles } from "@/providers/NotificationProvider";

export function useStockCandles(ticker: string, from: string, to: string) {
  return useQuery({
    queryKey: ["stockCandles", ticker, from, to],
    queryFn: async () => {
      const apiData = await marketsManager.getStockCandles(ticker, from, to);
      if (apiData.length > 0) return apiData;
      // Exchange has no historical data — use accumulated live price ticks
      return getPriceHistoryCandles(ticker);
    },
    staleTime: 0,          // always refetch so live history is fresh on remount
    refetchOnMount: true,  // repopulate chart immediately when returning to a page
    enabled: !!ticker,
  });
}
