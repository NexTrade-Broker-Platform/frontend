import axios from "axios";
import { walletRepository } from "@/features/wallet/services/walletRepository";
import {
  mapDepositResponse,
  mapWalletBalanceResponse,
  mapWalletTransactionsPageResponse,
} from "@/features/wallet/utils/walletMappers";
import type {
  DepositFormData,
  DepositResult,
  WalletBalance,
  WalletTransactionsPage,
  WithdrawFormData,
} from "@/features/wallet/types/wallet";

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.error?.message;
    if (typeof msg === "string") return msg;

    if (error.response?.status === 401) return "You are not authenticated.";
    if (error.response?.status === 400) return "Invalid wallet request.";
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

  async withdraw(data: WithdrawFormData): Promise<DepositResult> {
    try {
      const response = await walletRepository.withdraw({
        amount: data.amount,
        currency: data.currency,
      });

      return mapDepositResponse(response.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async getBalance(currency = "USD"): Promise<WalletBalance> {
    try {
      const response = await walletRepository.getBalance(currency);
      return mapWalletBalanceResponse(response.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async getTransactions(page = 0, limit = 10): Promise<WalletTransactionsPage> {
    try {
      const response = await walletRepository.getTransactions(page, limit);
      return mapWalletTransactionsPageResponse(response.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
