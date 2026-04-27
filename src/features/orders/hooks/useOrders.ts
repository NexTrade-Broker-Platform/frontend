import { useQuery } from "@tanstack/react-query";
import { ordersManager } from "@/features/orders/services/ordersManager";
import type { OrdersQueryParams } from "@/features/orders/types/orders";

export function useOrders(params?: OrdersQueryParams) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersManager.getOrders(params),
  });
}
