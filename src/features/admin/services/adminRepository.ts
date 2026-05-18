import { adminApi } from "@/shared/lib/api/adminApiClient";
import type { AdminStatsDto, AdminUser, AdminOrder, UpdateFeeRateDto, UpdateFeeRateResponseDto } from "@/features/admin/types/admin";

export const adminRepository = {
  getStats() {
    return adminApi.get<AdminStatsDto>("/admin/stats");
  },

  updateFeeRate(data: UpdateFeeRateDto) {
    return adminApi.patch<UpdateFeeRateResponseDto>("/admin/fee-rate", data);
  },

  getUsers() {
    return adminApi.get<AdminUser[]>("/admin/users");
  },

  getOrders() {
    return adminApi.get<AdminOrder[]>("/admin/orders");
  },

  getUserOrders(userId: string) {
    return adminApi.get<AdminOrder[]>(`/admin/users/${userId}/orders`);
  },
};
