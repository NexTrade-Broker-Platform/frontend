import { api } from "@/shared/lib/api/httpClient";
import type {
  MarketStatusResponseDto,
  MarketsQueryParams,
  OptionDetailResponseDto,
  OptionsListResponseDto,
  StockDetailResponseDto,
  StockHistoryResponseDto,
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

  getOption(optionId: string) {
    return api.get<OptionDetailResponseDto>(`/market/options/${optionId}`);
  },

  getStockHistory(ticker: string, from: string, to: string) {
    return api.get<StockHistoryResponseDto>(`/market/stocks/${ticker}/history`, { params: { from, to } });
  },

  getMarketStatus() {
    return api.get<MarketStatusResponseDto>("/market/status");
  },

  getMarketEvents() {
    return api.get<{ events: MarketEvent[] }>("/market/events");
  },
};
