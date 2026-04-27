import { useQuery } from "@tanstack/react-query";
import { landingManager } from "../services/landingManager";

export function useLandingStats() {
  const query = useQuery({
    queryKey: ["landing-stats"],
    queryFn: landingManager.getLandingStats,
    retry: false,
  });

  return {
    stats: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
