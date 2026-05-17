import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useOrder } from "@/features/orders/hooks/useOrder";
import { useCancelOrder } from "@/features/orders/hooks/useCancelOrder";
import { FadeIn } from "@/shared/components/FadeIn";
import type { Order } from "@/features/orders/types/orders";
import { OrderStatusBadge, CANCELLABLE_STATUSES } from "./components/OrderStatusBadge";
import { CancelOrderModal } from "./components/CancelOrderModal";

function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function StatCell({ label, value, valueClassName }: { label: string; value: React.ReactNode; valueClassName?: string }) {
  return (
    <div className="flex flex-1 flex-col px-4 py-3">
      <span className="mb-0.5 text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${valueClassName ?? "text-foreground"}`}>{value}</span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function OrderDetailContent({ order, onCancelled }: { order: Order; onCancelled: () => void }) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const { mutate: cancelOrder, isPending } = useCancelOrder();

  const isCancellable = CANCELLABLE_STATUSES.includes(order.status);
  const remaining = order.quantity - order.filledQuantity;

  function handleConfirmCancel() {
    cancelOrder(order.orderId, {
      onSuccess: () => {
        toast.success("Order cancelled.");
        setCancelOpen(false);
        onCancelled();
      },
      onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to cancel order."),
    });
  }

  return (
    <>
      {/* Header */}
      <FadeIn delay={75}>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span
                className={`flex size-12 items-center justify-center rounded-2xl text-sm font-bold sm:size-14 ${
                  order.side === "BUY"
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {order.side}
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                  {order.instrumentId}
                </h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {order.instrumentType} · {order.orderType} order
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Created {formatDateTime(order.createdAt)}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </FadeIn>

      {/* Stat bar */}
      <FadeIn delay={150}>
        <div className="mb-6 flex divide-x divide-border overflow-x-auto rounded-2xl border border-border bg-card">
          <StatCell label="Quantity" value={order.quantity.toLocaleString()} />
          <StatCell label="Filled" value={order.filledQuantity.toLocaleString()} valueClassName="text-success" />
          <StatCell label="Remaining" value={remaining.toLocaleString()} />
          <StatCell
            label="Price"
            value={order.limitPrice != null ? `$${order.limitPrice.toFixed(2)}` : "Market"}
          />
        </div>
      </FadeIn>

      {/* Detail card */}
      <FadeIn delay={225}>
        <div className="mb-6 rounded-2xl border border-border bg-card px-5">
          <div className="divide-y divide-border">
            {order.averageFillPrice != null && (
              <DetailRow label="Avg Fill Price" value={`$${order.averageFillPrice.toFixed(2)}`} />
            )}
            {order.exchangeFee != null && (
              <DetailRow label="Exchange Fee" value={`$${order.exchangeFee.toFixed(4)}`} />
            )}
            <DetailRow label="Updated At" value={formatDateTime(order.updatedAt)} />
            {order.expiresAt != null && (
              <DetailRow label="Expires At" value={formatDateTime(order.expiresAt)} />
            )}
            <DetailRow label="Order ID" value={
              <span className="font-mono text-xs">{order.orderId}</span>
            } />
          </div>
        </div>
      </FadeIn>

      {/* Cancel */}
      {isCancellable && (
        <FadeIn delay={300}>
          <button
            type="button"
            onClick={() => setCancelOpen(true)}
            className="w-full rounded-2xl bg-destructive px-6 py-3 font-semibold text-destructive-foreground shadow-lg shadow-destructive/20 transition-all hover:bg-destructive/90 active:scale-95"
          >
            Cancel Order
          </button>
        </FadeIn>
      )}

      {cancelOpen && (
        <CancelOrderModal
          order={order}
          onClose={() => setCancelOpen(false)}
          onConfirmed={handleConfirmCancel}
          isPending={isPending}
        />
      )}
    </>
  );
}

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const stateOrder = (location.state as { order?: Order } | null)?.order;
  const { data: order, isLoading, isError, error } = useOrder(orderId!, stateOrder);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-3 size-10 text-destructive" />
          <p className="mb-4 text-muted-foreground">
            {(error as Error)?.message ?? "Order not found"}
          </p>
          <Link to="/orders" className="text-primary hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <FadeIn>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Orders
        </button>
      </FadeIn>

      <OrderDetailContent order={order} onCancelled={() => navigate("/orders")} />
    </div>
  );
}
