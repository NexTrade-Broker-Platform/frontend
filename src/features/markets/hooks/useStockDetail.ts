import { useQuery } from "@tanstack/react-query";
import { marketsManager } from "@/features/markets/services/marketsManager";

export function useStockDetail(ticker: string) {
  return useQuery({
    queryKey: ["stock-detail", ticker],
    queryFn: () => marketsManager.getStockDetail(ticker),
    staleTime: 10_000,
    enabled: !!ticker,
  });
}
