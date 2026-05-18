export interface AdminStatsDto {
  total_revenue: number;
  total_users: number;
  total_running_bots: number;
  fee_rate: number;
  total_money: number;
  total_orders: number;
}

export interface AdminStats {
  totalRevenue: number;
  totalUsers: number;
  totalRunningBots: number;
  feeRate: number;
  totalMoney: number;
  totalOrders: number;
}

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  walletBalance: number;
  isBotRunning: boolean;
  createdAt: string;
}

export interface AdminOrder {
  orderId: string;
  platformUserId: string;
  instrumentId: string;
  side: "BUY" | "SELL";
  orderType: "MARKET" | "LIMIT";
  status: string;
  quantity: number;
  limitPrice: number | null;
  filledQuantity: number;
  averageFillPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateFeeRateDto {
  fee_rate: number;
}

export interface UpdateFeeRateResponseDto {
  message: string;
  fee_rate: number;
}
