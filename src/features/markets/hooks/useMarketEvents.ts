import { useQuery } from "@tanstack/react-query";
import { marketsRepository } from "@/features/markets/services/marketsRepository";

export function useMarketEvents() {
  return useQuery({
    queryKey: ["market-events"],
    queryFn: async () => {
      const response = await marketsRepository.getMarketEvents();
      return response.data.events;
    },
    staleTime: 30_000,
  });
}
