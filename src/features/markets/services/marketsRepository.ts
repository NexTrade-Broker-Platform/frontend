import { api } from "@/shared/lib/api/httpClient";
import type {
  MarketsQueryParams,
  OptionsListResponseDto,
  StockDetailResponseDto,
  StockListResponseDto,
} from "@/features/markets/types/markets";
import type { MarketEvent } from "@/providers/NotificationProvider";

export const marketsRepository = {
  getStocks(params?: MarketsQueryParams) {
    return api.get<StockListResponseDto>("/market/stocks", { params });
  },

  getStockDetail(ticker: string) {
    return api.get<StockDetailResponseDto>(`/market/stocks/${ticker}`);
  },

  getOptions() {
    return api.get<OptionsListResponseDto>("/market/options");
  },

  getMarketEvents() {
    return api.get<{ events: MarketEvent[] }>("/market/events");
  },
};
