import { api } from "@/shared/lib/api/httpClient";
import type {
  DepositRequestDto,
  DepositResponseDto,
  WithdrawRequestDto,
  WithdrawResponseDto,
  WalletBalanceResponseDto,
  WalletTransactionsPageResponseDto,
} from "@/features/wallet/types/wallet";

export const walletRepository = {
  deposit(data: DepositRequestDto) {
    return api.post<DepositResponseDto>("/funds/deposit", data);
  },

  withdraw(data: WithdrawRequestDto) {
    return api.post<WithdrawResponseDto>("/funds/withdraw", data);
  },

  getBalance(currency = "USD") {
    return api.get<WalletBalanceResponseDto>("/funds/balance", {
      params: { currency },
    });
  },

  getTransactions(page = 0, limit = 10) {
    return api.get<WalletTransactionsPageResponseDto>("/funds/transactions", {
      params: { page, limit },
    });
  },
};
