import { useQuery } from "@tanstack/react-query";
import { portfolioManager } from "@/features/portfolio/services/portfolioManager";

export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: portfolioManager.getPortfolio,
  });
}
