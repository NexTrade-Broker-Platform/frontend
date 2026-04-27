import { useQuery } from "@tanstack/react-query";
import { walletManager } from "@/features/wallet/services/walletManager";

export function useWalletBalance(currency = "USD") {
  return useQuery({
    queryKey: ["wallet", "balance", currency],
    queryFn: () => walletManager.getBalance(currency),
  });
}
