import axios from "axios";
import { adminRepository } from "./adminRepository";
import { adminMappers } from "../utils/adminMappers";
import type { AdminStats, AdminUser, AdminOrder } from "@/features/admin/types/admin";

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
      return adminMappers.mapStats(response.data);
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

  async getUsers(): Promise<AdminUser[]> {
    try {
      const response = await adminRepository.getUsers();
      return response.data.map(adminMappers.mapUser);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async getOrders(): Promise<AdminOrder[]> {
    try {
      const response = await adminRepository.getOrders();
      return response.data.map(adminMappers.mapOrder);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async getUserOrders(userId: string): Promise<AdminOrder[]> {
    try {
      const response = await adminRepository.getUserOrders(userId);
      return response.data.map(adminMappers.mapOrder);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
