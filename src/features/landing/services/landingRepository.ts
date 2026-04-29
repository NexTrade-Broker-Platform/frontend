import { publicApi } from "@/shared/lib/api/httpClient";
import type {
  LandingStatsResponseDto,
  StockListResponseDto,
} from "../types/landing";

async function getLandingStats(): Promise<LandingStatsResponseDto> {
  const response = await publicApi.get("api/market/stocks", {
    params: { limit: 3 },
  });
  return response.data;
}

async function getMarketPreview(): Promise<StockListResponseDto> {
  const response = await publicApi.get("api/market/stocks", {
    params: { limit: 3 },
  });
  return response.data;
}

export const landingRepository = {
  getLandingStats,
  getMarketPreview,
};
