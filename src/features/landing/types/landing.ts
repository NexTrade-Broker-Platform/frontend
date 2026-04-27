export type LandingStat = {
  label: string;
  value: string;
};

export type LandingStatsResponseDto = {
  totalUsers: number;
  totalOrders: number;
  totalVolume: number;
  activeTickers: number;
};

export type StockPreview = {
  ticker: string;
  name: string;
  currentPrice: number;
  changePercent: number;
};

export type StockPreviewDto = {
  ticker: string;
  name: string;
  sector: string;
  current_price: number;
  open_price: number;
  high_price: number;
  low_price: number;
  volume: number;
  listed_at: string;
};

export type StockListResponseDto = {
  stocks: StockPreviewDto[];
};
