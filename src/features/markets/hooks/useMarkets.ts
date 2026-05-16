import { useQuery } from "@tanstack/react-query";
import { marketsManager } from "@/features/markets/services/marketsManager";
import type { MarketsQueryParams } from "@/features/markets/types/markets";

export function useMarkets(params?: MarketsQueryParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["markets", params],
    queryFn: () => marketsManager.getMarketList(params),
    staleTime: 30_000,
    enabled: options?.enabled ?? true,
  });
}
