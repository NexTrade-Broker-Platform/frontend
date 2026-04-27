import type { LandingStat, LandingStatsResponseDto, StockListResponseDto, StockPreview } from "../types/landing";

export function mapLandingStats(dto: LandingStatsResponseDto): LandingStat[] {
  return [
    { label: "Registered users", value: dto.totalUsers.toLocaleString() },
    { label: "Orders placed", value: dto.totalOrders.toLocaleString() },
    { label: "Trading volume", value: `$${dto.totalVolume.toLocaleString()}` },
    { label: "Active tickers", value: dto.activeTickers.toString() },
  ];
}

export function mapStockPreviews(dto: StockListResponseDto): StockPreview[] {
  return dto.stocks.map((s) => ({
    ticker: s.ticker,
    name: s.name,
    currentPrice: s.current_price,
    changePercent:
      s.open_price > 0
        ? ((s.current_price - s.open_price) / s.open_price) * 100
        : 0,
  }));
}
