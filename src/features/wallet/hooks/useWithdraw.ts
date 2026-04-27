import { useMutation, useQueryClient } from "@tanstack/react-query";
import { walletManager } from "@/features/wallet/services/walletManager";
import type { WithdrawFormData } from "@/features/wallet/types/wallet";

export function useWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WithdrawFormData) => walletManager.withdraw(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}
