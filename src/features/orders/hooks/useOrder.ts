import { useQuery } from "@tanstack/react-query";
import { ordersManager } from "@/features/orders/services/ordersManager";

export function useOrder(orderId: string, initialData?: import("@/features/orders/types/orders").Order) {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => ordersManager.getOrder(orderId),
    initialData,
    staleTime: initialData ? 10_000 : 0,
  });
}
