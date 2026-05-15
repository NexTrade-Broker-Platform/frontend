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

export interface OptionDto {
  option_id: string;
  underlying_ticker: string;
  option_type: "CALL" | "PUT";
  strike_price: number;
  expiry_time: string;
  premium: number;
  is_active: boolean;
}

export interface OptionsListResponseDto {
  options: OptionDto[];
}

export interface Option {
  optionId: string;
  underlyingTicker: string;
  optionType: "CALL" | "PUT";
  strikePrice: number;
  expiryTime: string;
  premium: number;
  isActive: boolean;
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
