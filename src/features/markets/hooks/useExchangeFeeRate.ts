import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/lib/api/httpClient";

export function useExchangeFeeRate(): number {
  const { data } = useQuery({
    queryKey: ["fees", "exchange-rate"],
    queryFn: () => api.get<number>("/fees/exchange-rate").then((r) => r.data),
    staleTime: 60_000,
    retry: false,
  });
  return data != null && data > 0 ? data : 0.001;
}
