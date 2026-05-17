import { adminApi } from "@/shared/lib/api/adminApiClient";
import type { AdminStatsDto, UpdateFeeRateDto, UpdateFeeRateResponseDto } from "@/features/admin/types/admin";

export const adminRepository = {
  getStats() {
    return adminApi.get<AdminStatsDto>("/admin/stats");
  },

  updateFeeRate(data: UpdateFeeRateDto) {
    return adminApi.patch<UpdateFeeRateResponseDto>("/admin/fee-rate", data);
  },
};
