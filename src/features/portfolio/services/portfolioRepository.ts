import { api } from "@/shared/lib/api/httpClient";
import type { PortfolioResponseDto } from "@/features/portfolio/types/portfolio";

export const portfolioRepository = {
  getPortfolio() {
    return api.get<PortfolioResponseDto>("/portfolio");
  },
};
