import { api } from "@/shared/lib/api/httpClient";
import type {
  MarketsQueryParams,
  StockDetailResponseDto,
  StockListResponseDto,
} from "@/features/markets/types/markets";

export const marketsRepository = {
  getStocks(params?: MarketsQueryParams) {
    return api.get<StockListResponseDto>("/market/stocks", { params });
  },

  getStockDetail(ticker: string) {
    return api.get<StockDetailResponseDto>(`/market/stocks/${ticker}`);
  },
};
