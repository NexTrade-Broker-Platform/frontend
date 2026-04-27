export interface StockDto {
  ticker: string;
  name: string;
  sector: string;
  current_price: number;
  open_price: number;
  high_price: number;
  low_price: number;
  volume: number;
  listed_at: string;
}

export interface ChartDataPointDto {
  time: string;
  price: number;
}

export interface StockListResponseDto {
  stocks: StockDto[];
}

export interface StockDetailResponseDto {
  stock: StockDto;
  chart_data: ChartDataPointDto[];
}

export interface MarketsQueryParams {
  sector?: string;
  page?: number;
  limit?: number;
}

export interface Stock {
  ticker: string;
  name: string;
  sector: string;
  currentPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  listedAt: string;
  change: number;
  changePercent: number;
}

export interface ChartDataPoint {
  time: string;
  price: number;
}

export interface StockDetail {
  stock: Stock;
  chartData: ChartDataPoint[];
}
