import { useState } from "react";
import { useNavigate } from "react-router";
import { FadeIn } from "@/shared/components/FadeIn";
import { useInfiniteOrders } from "@/features/orders/hooks/useInfiniteOrders";
import type { Order, OrderStatus } from "@/features/orders/types/orders";
import { OrdersFilterBar, type FilterTab } from "./components/OrdersFilterBar";
import { OrdersList } from "./components/OrdersList";

function filterToStatus(tab: FilterTab): OrderStatus | undefined {
  if (tab === "ALL") return undefined;
  return tab as OrderStatus;
}

export function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("ALL");
  const navigate = useNavigate();

  const query = useInfiniteOrders(filterToStatus(activeFilter));

  function handleOrderClick(order: Order) {
    navigate(`/orders/${order.orderId}`, { state: { order } });
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <FadeIn>
        <div className="mb-8">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Trading
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Orders</h1>
          <p className="mt-2 text-muted-foreground">Your order history and active positions</p>
        </div>
      </FadeIn>

      <FadeIn delay={75}>
        <OrdersFilterBar active={activeFilter} onChange={setActiveFilter} />
      </FadeIn>

      <FadeIn delay={150}>
        <OrdersList query={query} onOrderClick={handleOrderClick} />
      </FadeIn>
    </div>
  );
}
