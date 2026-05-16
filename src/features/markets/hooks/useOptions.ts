import { useQuery } from "@tanstack/react-query";
import { marketsManager } from "@/features/markets/services/marketsManager";

export function useOptions(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["options"],
    queryFn: () => marketsManager.getOptionsList(),
    staleTime: 60_000,
    enabled: options?.enabled ?? true,
  });
}
