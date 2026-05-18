import type { AdminOrder, AdminStatsDto, AdminStats, AdminUser } from "../types/admin";
import type { PortfolioResponseDto, Portfolio } from "@/features/portfolio/types/portfolio";
import type { WalletBalanceResponseDto, WalletBalanceResponse } from "@/features/wallet/types/wallet";

export const adminMappers = {
  mapStats(d: AdminStatsDto): AdminStats {
    return {
      totalRevenue: d.total_revenue,
      totalUsers: d.total_users,
      totalRunningBots: d.total_running_bots,
      feeRate: d.fee_rate,
      totalMoney: d.total_money,
      totalOrders: d.total_orders,
    };
  },

  mapOrder(d: any): AdminOrder {
    return {
      orderId: d.order_id,
      platformUserId: d.platform_user_id,
      instrumentId: d.instrument_id,
      side: d.side,
      orderType: d.order_type,
      status: d.status,
      quantity: d.quantity,
      limitPrice: d.limit_price,
      filledQuantity: d.filled_quantity,
      averageFillPrice: d.average_fill_price,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    };
  },

  mapUser(d: any): AdminUser {
    return {
      id: d.id,
      email: d.email,
      username: d.username,
      firstName: d.first_name,
      lastName: d.last_name,
      walletBalance: d.wallet_balance,
      isBotRunning: d.is_bot_running,
      createdAt: d.created_at,
    };
  },

  mapPortfolio(d: any): Portfolio {
    return {
      cashBalances: (d.cash_balances || []).map((b: any) => ({
        currency: b.currency,
        availableBalance: b.available_balance,
        reservedBalance: b.reserved_balance,
      })),
      holdings: (d.holdings || []).map((h: any) => ({
        ticker: h.ticker,
        instrumentType: h.instrumentType,
        quantity: h.quantity,
        averagePrice: h.averageCost,
        currentPrice: h.currentPrice || h.averageCost, // Fallback if currentPrice is missing
        totalCost: h.totalCost || (h.quantity || 0) * (h.averageCost || 0),
      })),
    };
  },

  mapWallets(wallets: any[]): WalletBalanceResponse[] {
    return (wallets || []).map((w: any) => ({
      currency: w.currency,
      availableBalance: w.available_balance || w.availableBalance, // Support both just in case
      reservedBalance: w.reserved_balance || w.reservedBalance,
    }));
  }
};
