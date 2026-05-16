import { useQuery } from "@tanstack/react-query";
import { portfolioManager } from "@/features/portfolio/services/portfolioManager";

export function usePortfolioTimeseries(days = 30) {
  return useQuery({
    queryKey: ["portfolio", "timeseries", days],
    queryFn: () => portfolioManager.getPortfolioTimeseries(days),
  });
}
