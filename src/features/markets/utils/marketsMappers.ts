import type {
  Candle,
  CandleDto,
  ChartDataPoint,
  MarketStatus,
  MarketStatusResponseDto,
  Option,
  OptionDto,
  Stock,
  StockDetail,
  StockDetailResponseDto,
  StockDto,
} from "@/features/markets/types/markets";

export function mapStock(dto: StockDto): Stock {
  const change = dto.current_price - dto.open_price;
  const changePercent = dto.open_price !== 0 ? (change / dto.open_price) * 100 : 0;
  return {
    ticker: dto.ticker,
    name: dto.name,
    sector: dto.sector,
    currentPrice: dto.current_price,
    openPrice: dto.open_price,
    highPrice: dto.high_price,
    lowPrice: dto.low_price,
    volume: dto.volume,
    listedAt: dto.listed_at,
    change,
    changePercent,
  };
}

export function mapCandleToChartDataPoint(dto: CandleDto): ChartDataPoint {
  return { time: dto.timestamp, price: dto.close };
}

export function mapCandle(dto: CandleDto): Candle {
  return {
    time: Math.floor(new Date(dto.timestamp).getTime() / 1000),
    open: dto.open,
    high: dto.high,
    low: dto.low,
    close: dto.close,
    volume: dto.volume,
  };
}

export function mapStockDetail(dto: StockDetailResponseDto): StockDetail {
  return {
    stock: mapStock(dto.stock),
    chartData: dto.chart_data.map(mapCandleToChartDataPoint),
  };
}

export function mapOption(dto: OptionDto): Option {
  return {
    optionId: dto.option_id,
    underlyingTicker: dto.underlying_ticker,
    optionType: dto.option_type,
    strikePrice: dto.strike_price,
    expiryTime: dto.expiry_time,
    premium: dto.premium,
    isActive: dto.is_active,
    autoExercise: dto.auto_exercise ?? true,
  };
}

export function mapMarketStatus(dto: MarketStatusResponseDto): MarketStatus {
  return {
    connectionStatus: dto.connection_status,
    exchangeConnected: dto.exchange_connected,
    marketStatus: dto.market_status,
    isOpen: dto.is_open,
    platformId: dto.platform_id,
    marketTime: dto.market_time,
    marketDate: dto.market_date,
    realTime: dto.real_time,
    speedMultiplier: dto.speed_multiplier,
    lastSyncMarketTime: dto.last_sync_market_time,
    lastSyncAt: dto.last_sync_at,
  };
}
