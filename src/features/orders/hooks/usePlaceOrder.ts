import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersManager } from "@/features/orders/services/ordersManager";
import type { PlaceOrderFormData } from "@/features/orders/types/orders";

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PlaceOrderFormData) => ordersManager.placeOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });
}
