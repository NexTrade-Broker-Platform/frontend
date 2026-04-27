import type {
  CashBalance,
  CashBalanceDto,
  Holding,
  HoldingDto,
  Portfolio,
  PortfolioResponseDto,
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
    instrumentType: dto.instrument_type,
    quantity: dto.quantity,
    averageCost: dto.average_cost,
    totalCost: dto.quantity * dto.average_cost,
  };
}

export function mapPortfolio(dto: PortfolioResponseDto): Portfolio {
  return {
    cashBalances: dto.cash_balances.map(mapCashBalance),
    holdings: dto.holdings.map(mapHolding),
  };
}
