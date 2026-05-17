import type { OrderStatus } from "@/features/orders/types/orders";

export const CANCELLABLE_STATUSES: OrderStatus[] = ["PENDING", "PARTIALLY_FILLED"];

type BadgeConfig = {
  label: string;
  className: string;
};

const STATUS_CONFIG: Record<OrderStatus, BadgeConfig> = {
  PENDING: {
    label: "In Progress",
    className: "bg-primary/10 text-primary",
  },
  PARTIALLY_FILLED: {
    label: "Partially Filled",
    className: "bg-amber-500/10 text-amber-400",
  },
  FILLED: {
    label: "Filled",
    className: "bg-success/10 text-success",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive",
  },
  EXPIRED: {
    label: "Expired",
    className: "bg-muted text-muted-foreground",
  },
};

type Props = {
  status: OrderStatus;
};

export function OrderStatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
