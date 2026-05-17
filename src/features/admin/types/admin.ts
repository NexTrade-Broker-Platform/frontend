export interface AdminStatsDto {
  total_revenue: number;
  total_users: number;
  total_running_bots: number;
  fee_rate: number;
}

export interface AdminStats {
  totalRevenue: number;
  totalUsers: number;
  totalRunningBots: number;
  feeRate: number;
}

export interface UpdateFeeRateDto {
  fee_rate: number;
}

export interface UpdateFeeRateResponseDto {
  message: string;
  fee_rate: number;
}
