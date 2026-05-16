import { useQuery } from "@tanstack/react-query";
import { marketsManager } from "@/features/markets/services/marketsManager";

export function useStockCandles(ticker: string, from: string, to: string) {
  return useQuery({
    queryKey: ["stockCandles", ticker, from, to],
    queryFn: () => marketsManager.getStockCandles(ticker, from, to),
    staleTime: 5 * 60_000,
    enabled: !!ticker,
  });
}
