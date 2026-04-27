import { useQuery } from "@tanstack/react-query";
import { walletManager } from "@/features/wallet/services/walletManager";

export function useWalletTransactions(page = 0, limit = 10) {
  return useQuery({
    queryKey: ["wallet", "transactions", page, limit],
    queryFn: () => walletManager.getTransactions(page, limit),
  });
}
