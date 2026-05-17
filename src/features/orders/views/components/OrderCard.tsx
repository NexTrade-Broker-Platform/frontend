import type { Order } from "@/features/orders/types/orders";
import { OrderStatusBadge } from "./OrderStatusBadge";

type Props = {
  order: Order;
  onClick: () => void;
};

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function OrderCard({ order, onClick }: Props) {
  const isBuy = order.side === "BUY";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-accent"
    >
      <div className="flex flex-wrap items-start gap-3">
        {/* Side badge */}
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
            isBuy
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {order.side}
        </div>

        {/* Middle: instrument + order details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="truncate text-sm font-medium text-foreground">
              {order.instrumentId}
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {order.instrumentType}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            {/* Order type pill */}
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {order.orderType}
            </span>

            {/* Quantity */}
            <span className="text-xs text-muted-foreground">
              {order.quantity} shares
            </span>

            {/* Limit price */}
            {order.limitPrice != null && (
              <span className="text-xs text-muted-foreground">
                @ ${order.limitPrice.toFixed(2)}
              </span>
            )}

            {/* Filled quantity */}
            {order.filledQuantity > 0 && (
              <span className="text-xs text-muted-foreground">
                {order.filledQuantity} filled
              </span>
            )}
          </div>
        </div>

        {/* Right: status + date */}
        <div className="flex shrink-0 flex-col items-end gap-1">
          <OrderStatusBadge status={order.status} />
          <span className="text-xs text-muted-foreground">
            {formatDate(order.createdAt)}
          </span>
        </div>
      </div>
    </button>
  );
}
