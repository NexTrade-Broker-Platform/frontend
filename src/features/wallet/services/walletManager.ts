import axios from "axios";
import { mapDepositResponse } from "@/features/wallet/utils/walletMappers";
import { walletRepository } from "./walletRepository";
import type { DepositFormData, DepositResult } from "@/features/wallet/types/wallet";

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.error?.message;
    if (typeof msg === "string") return msg;
    if (error.response?.status === 402) return "Insufficient funds.";
  }
  return "Transaction failed. Please try again.";
}

export const walletManager = {
  async deposit(data: DepositFormData): Promise<DepositResult> {
    try {
      const response = await walletRepository.deposit({
        amount: data.amount,
        currency: data.currency,
      });
      return mapDepositResponse(response.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
