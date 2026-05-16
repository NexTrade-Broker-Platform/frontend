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

export interface CandleDto {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockListResponseDto {
  stocks: StockDto[];
}

export interface StockDetailResponseDto {
  stock: StockDto;
  chart_data: CandleDto[];
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

export interface StockHistoryResponseDto {
  ticker: string;
  from: string;
  to: string;
  chart_data: CandleDto[];
}

export interface MarketStatusResponseDto {
  connection_status: "CONNECTED" | "DISCONNECTED";
  exchange_connected: boolean;
  market_status: "OPEN" | "CLOSED";
  is_open: boolean;
  platform_id: string | null;
  market_time: string | null;
  market_date: string | null;
  real_time: string | null;
  speed_multiplier: number | null;
  last_sync_market_time: string | null;
  last_sync_at: string | null;
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

export interface Candle {
  time: number; // Unix seconds — works for both daily and intraday
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockDetail {
  stock: Stock;
  chartData: ChartDataPoint[];
}

export interface MarketStatus {
  connectionStatus: "CONNECTED" | "DISCONNECTED";
  exchangeConnected: boolean;
  marketStatus: "OPEN" | "CLOSED";
  isOpen: boolean;
  platformId: string | null;
  marketTime: string | null;
  marketDate: string | null;
  realTime: string | null;
  speedMultiplier: number | null;
  lastSyncMarketTime: string | null;
  lastSyncAt: string | null;
}
