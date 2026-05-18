import { useQuery } from "@tanstack/react-query";
import { adminManager } from "@/features/admin/services/adminManager";

export function useAdminOrders(userId?: string) {
  return useQuery({
    queryKey: ["admin", "orders", userId],
    queryFn: () => userId ? adminManager.getUserOrders(userId) : adminManager.getOrders(),
    refetchInterval: 30_000,
  });
}
