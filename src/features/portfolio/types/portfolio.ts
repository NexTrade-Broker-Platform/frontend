export interface CashBalanceDto {
  currency: string;
  available_balance: number;
  reserved_balance: number;
}

export interface HoldingDto {
  ticker: string;
  instrumentType: string;
  quantity: number;
  averageCost: number;
}

export interface PortfolioResponseDto {
  cash_balances: CashBalanceDto[];
  holdings: HoldingDto[];
}

export interface CashBalance {
  currency: string;
  availableBalance: number;
  reservedBalance: number;
}

export interface Holding {
  ticker: string;
  instrumentType: string;
  quantity: number;
  averageCost: number;
  totalCost: number;
}

export interface Portfolio {
  cashBalances: CashBalance[];
  holdings: Holding[];
}
