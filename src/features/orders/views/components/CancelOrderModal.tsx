import { AlertTriangle, Loader2, X } from "lucide-react";
import type { Order } from "@/features/orders/types/orders";

type Props = {
  order: Order;
  onClose: () => void;
  onConfirmed: () => void;
  isPending: boolean;
};

export function CancelOrderModal({ order, onClose, onConfirmed, isPending }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <AlertTriangle className="size-5 text-amber-500" />
          </div>
          <h2 className="text-lg font-semibold">Cancel Order?</h2>
        </div>

        {/* Body */}
        <p className="mt-4 text-sm text-muted-foreground">
          This will cancel your{" "}
          <span className="font-medium text-foreground">{order.side}</span> order
          for{" "}
          <span className="font-medium text-foreground">{order.quantity}</span>{" "}
          shares of{" "}
          <span className="font-medium text-foreground">{order.instrumentId}</span>
          . Any unfilled portion will be released.
        </p>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            Keep Order
          </button>
          <button
            type="button"
            onClick={onConfirmed}
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
