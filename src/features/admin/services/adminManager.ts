import axios from "axios";
import { adminRepository } from "./adminRepository";
import type { AdminStats } from "@/features/admin/types/admin";

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.error?.message;
    if (typeof msg === "string") return msg;
    if (error.response?.status === 403) return "Access denied.";
  }
  return "Request failed. Please try again.";
}

export const adminManager = {
  async getStats(): Promise<AdminStats> {
    try {
      const response = await adminRepository.getStats();
      const d = response.data;
      return {
        totalRevenue: d.total_revenue,
        totalUsers: d.total_users,
        totalRunningBots: d.total_running_bots,
        feeRate: d.fee_rate,
      };
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async updateFeeRate(feeRate: number): Promise<number> {
    try {
      const response = await adminRepository.updateFeeRate({ fee_rate: feeRate });
      return response.data.fee_rate;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
