import { useMutation, useQueryClient } from "@tanstack/react-query";
import { walletManager } from "@/features/wallet/services/walletManager";
import type { DepositFormData } from "@/features/wallet/types/wallet";

export function useDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DepositFormData) => walletManager.deposit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}
