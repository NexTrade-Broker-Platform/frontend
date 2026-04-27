import { api } from "@/shared/lib/api/httpClient";
import type { DepositRequestDto, DepositResponseDto } from "@/features/wallet/types/wallet";

export const walletRepository = {
  deposit(data: DepositRequestDto) {
    return api.post<DepositResponseDto>("/funds/deposit", data);
  },
};
