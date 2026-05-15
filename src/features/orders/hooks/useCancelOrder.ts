import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersManager } from "@/features/orders/services/ordersManager";

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => ordersManager.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}
