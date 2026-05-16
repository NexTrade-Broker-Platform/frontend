import type {
  CashBalance,
  CashBalanceDto,
  Holding,
  HoldingDto,
  Portfolio,
  PortfolioResponseDto,
  PortfolioTimeseries,
  PortfolioTimeseriesPoint,
  PortfolioTimeseriesPointDto,
  PortfolioTimeseriesResponseDto,
} from "@/features/portfolio/types/portfolio";

function mapCashBalance(dto: CashBalanceDto): CashBalance {
  return {
    currency: dto.currency,
    availableBalance: dto.available_balance,
    reservedBalance: dto.reserved_balance,
  };
}

function mapHolding(dto: HoldingDto): Holding {
  return {
    ticker: dto.ticker,
    instrumentType: dto.instrumentType,
    quantity: dto.quantity,
    averageCost: dto.averageCost,
    totalCost: dto.quantity * dto.averageCost,
  };
}

export function mapPortfolio(dto: PortfolioResponseDto): Portfolio {
  return {
    cashBalances: (dto.cash_balances ?? []).map(mapCashBalance),
    holdings: (dto.holdings ?? []).map(mapHolding),
  };
}

function mapPortfolioTimeseriesPoint(dto: PortfolioTimeseriesPointDto): PortfolioTimeseriesPoint {
  return {
    date: dto.date,
    cashValue: dto.cash_value,
    stocksValue: dto.stocks_value,
    totalValue: dto.total_value,
  };
}

export function mapPortfolioTimeseries(dto: PortfolioTimeseriesResponseDto): PortfolioTimeseries {
  return {
    points: (dto.points ?? []).map(mapPortfolioTimeseriesPoint),
  };
}
