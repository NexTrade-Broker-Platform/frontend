import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/lib/api/httpClient";

export function useFeeRate(): number {
  const { data } = useQuery({
    queryKey: ["fees", "rate"],
    queryFn: () => api.get<number>("/fees/rate").then((r) => r.data),
    staleTime: 60_000,
    retry: false,
  });
  return data ?? 0.01;
}
