import axios from "axios";
import { mapStock, mapStockDetail } from "@/features/markets/utils/marketsMappers";
import { marketsRepository } from "./marketsRepository";
import type { MarketsQueryParams, Stock, StockDetail } from "@/features/markets/types/markets";

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.error?.message;
    if (typeof msg === "string") return msg;
    if (error.response?.status === 404) return "Stock not found.";
  }
  return "Failed to load market data. Please try again.";
}

export const marketsManager = {
  async getMarketList(params?: MarketsQueryParams): Promise<Stock[]> {
    try {
      const response = await marketsRepository.getStocks(params);
      return response.data.stocks.map(mapStock);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async getStockDetail(ticker: string): Promise<StockDetail> {
    try {
      const response = await marketsRepository.getStockDetail(ticker);
      return mapStockDetail(response.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
