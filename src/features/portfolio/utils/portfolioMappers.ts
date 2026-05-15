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
