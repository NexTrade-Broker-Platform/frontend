import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminManager } from "@/features/admin/services/adminManager";

export function useUpdateFeeRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (feeRate: number) => adminManager.updateFeeRate(feeRate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}
