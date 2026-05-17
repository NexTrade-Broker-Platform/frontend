import { useInfiniteQuery } from "@tanstack/react-query";
import { ordersManager } from "@/features/orders/services/ordersManager";
import type { OrderStatus } from "@/features/orders/types/orders";

const PAGE_SIZE = 15;

export function useInfiniteOrders(status?: OrderStatus) {
  return useInfiniteQuery({
    queryKey: ["orders", "infinite", status ?? "ALL"],
    queryFn: ({ pageParam }) =>
      ordersManager.getOrders({ status, page: pageParam as number, limit: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage.pagination;
      return (page + 1) * limit < total ? page + 1 : undefined;
    },
  });
}
