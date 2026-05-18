import { useAdminOrders } from "@/features/admin/hooks/useAdminOrders";
import { FadeIn } from "@/shared/components/FadeIn";
import { Loader2, History, ArrowUpRight, ArrowDownLeft, Clock, Calendar } from "lucide-react";
import { useParams } from "react-router";

export function PlatformOrdersPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: orders, isLoading, isError, error } = useAdminOrders(userId);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>Error loading orders: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <FadeIn>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-destructive">
              Admin
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              {userId ? "User Orders" : "Platform Orders"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {userId 
                ? `Order history for user ${userId}` 
                : "Complete order history across the entire platform"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-foreground">{orders?.length ?? 0}</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-center">Side</th>
                  <th className="px-6 py-4 font-semibold">Instrument</th>
                  <th className="px-6 py-4 font-semibold text-right">Quantity</th>
                  <th className="px-6 py-4 font-semibold text-right">Price</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                  {!userId && <th className="px-6 py-4 font-semibold">User ID</th>}
                  <th className="px-6 py-4 font-semibold text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => (
                  <tr key={order.orderId || Math.random()} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4 text-center">
                      {(order.side || "").toUpperCase() === "BUY" ? (
                        <div className="mx-auto flex size-8 items-center justify-center rounded-lg bg-success/10 text-success">
                          <ArrowUpRight className="size-4" />
                        </div>
                      ) : (
                        <div className="mx-auto flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                          <ArrowDownLeft className="size-4" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{order.instrumentId || "Unknown"}</span>
                        <span className="rounded bg-muted px-1 py-0.5 text-[10px] font-bold text-muted-foreground">
                          {order.orderType || "MARKET"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-mono text-foreground">
                        {(order.filledQuantity || 0) > 0 ? (
                          <>
                            <span className="font-bold">{(order.filledQuantity || 0).toLocaleString()}</span>
                            <span className="text-muted-foreground"> / {(order.quantity || 0).toLocaleString()}</span>
                          </>
                        ) : (
                          (order.quantity || 0).toLocaleString()
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-mono font-bold text-foreground">
                        ${(order.averageFillPrice || order.limitPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status || "UNKNOWN"}
                      </span>
                    </td>
                    {!userId && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                          {order.platformUserId ? `${order.platformUserId.substring(0, 8)}...` : "—"}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-0.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : "—"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "FILLED": return "bg-success/10 text-success";
    case "PARTIALLY_FILLED": return "bg-amber-500/10 text-amber-500";
    case "PENDING": return "bg-primary/10 text-primary";
    case "CANCELLED": return "bg-muted text-muted-foreground";
    case "REJECTED": return "bg-destructive/10 text-destructive";
    case "EXPIRED": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
}

