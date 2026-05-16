import { useQuery } from "@tanstack/react-query";
import { marketsManager } from "@/features/markets/services/marketsManager";

export function useMarketStatus() {
  return useQuery({
    queryKey: ["market-status"],
    queryFn: () => marketsManager.getMarketStatus(),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}
