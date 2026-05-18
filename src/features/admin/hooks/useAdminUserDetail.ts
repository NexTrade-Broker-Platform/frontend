import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/shared/lib/api/adminApiClient";
import { adminMappers } from "../utils/adminMappers";
import type { Portfolio } from "@/features/portfolio/types/portfolio";
import type { WalletBalanceResponse } from "@/features/wallet/types/wallet";
import type { AdminOrder, AdminUser } from "../types/admin";

export interface UserDetail {
  id: string;
  info: AdminUser | null;
  portfolio: Portfolio;
  wallets: WalletBalanceResponse[];
  orders: AdminOrder[];
}

export function useAdminUserDetail(userId: string) {
  return useQuery({
    queryKey: ["admin", "users", userId, "detail"],
    queryFn: async (): Promise<UserDetail> => {
      const [infoRes, portfolioRes, walletsRes, ordersRes] = await Promise.all([
        adminApi.get<AdminUser[]>("/admin/users"), // We find the user in the list for now or could add a specific endpoint
        adminApi.get(`/admin/users/${userId}/portfolio`),
        adminApi.get(`/admin/users/${userId}/wallets`),
        adminApi.get<any[]>(`/admin/users/${userId}/orders`),
      ]);

      const allUsers = infoRes.data.map(adminMappers.mapUser);
      const userInfo = allUsers.find(u => u.id === userId) || null;

      return {
        id: userId,
        info: userInfo,
        portfolio: adminMappers.mapPortfolio(portfolioRes.data),
        wallets: adminMappers.mapWallets(walletsRes.data),
        orders: (ordersRes.data || []).map(adminMappers.mapOrder),
      };
    },
    enabled: !!userId,
  });
}
