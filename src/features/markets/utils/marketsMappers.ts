import type {
  ChartDataPoint,
  ChartDataPointDto,
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

function mapChartDataPoint(dto: ChartDataPointDto): ChartDataPoint {
  return { time: dto.time, price: dto.price };
}

export function mapStockDetail(dto: StockDetailResponseDto): StockDetail {
  return {
    stock: mapStock(dto.stock),
    chartData: dto.chart_data.map(mapChartDataPoint),
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
  };
}
