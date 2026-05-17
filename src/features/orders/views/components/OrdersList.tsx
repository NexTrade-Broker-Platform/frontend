import { useEffect, useRef } from "react";
import { ClipboardList, Loader2 } from "lucide-react";
import type { useInfiniteOrders } from "@/features/orders/hooks/useInfiniteOrders";
import type { Order } from "@/features/orders/types/orders";
import { FadeIn } from "@/shared/components/FadeIn";
import { OrderCard } from "./OrderCard";

type Props = {
  query: ReturnType<typeof useInfiniteOrders>;
  onOrderClick: (order: Order) => void;
};

export function OrdersList({ query, onOrderClick }: Props) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = query;

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const orders = data?.pages.flatMap((p) => p.orders) ?? [];

  /* Initial loading skeletons */
  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="mb-3 h-20 animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>
    );
  }

  /* Empty state */
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <ClipboardList className="size-10 opacity-20" />
        <p className="text-sm">No orders found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3">
        {orders.map((order, i) => (
          <FadeIn key={order.orderId} delay={i * 30}>
            <OrderCard order={order} onClick={() => onOrderClick(order)} />
          </FadeIn>
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="py-4 text-center">
        {isFetchingNextPage && (
          <Loader2 className="mx-auto size-4 animate-spin text-muted-foreground" />
        )}
        {!hasNextPage && orders.length > 0 && (
          <p className="text-xs text-muted-foreground">All orders loaded</p>
        )}
      </div>
    </div>
  );
}
