import { api } from "@/shared/lib/api/httpClient";
import type {
  PortfolioResponseDto,
  PortfolioTimeseriesResponseDto,
} from "@/features/portfolio/types/portfolio";

export const portfolioRepository = {
  getPortfolio() {
    return api.get<PortfolioResponseDto>("/portfolio");
  },

  getPortfolioTimeseries(days = 30) {
    return api.get<PortfolioTimeseriesResponseDto>("/portfolio/timeseries", {
      params: { days },
    });
  },
};
