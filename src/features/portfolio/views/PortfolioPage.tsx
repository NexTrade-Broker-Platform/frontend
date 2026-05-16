import { useState } from "react";
import { AlertCircle, Loader2, Search, X } from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router";
import { toast } from "sonner";
import { usePortfolio } from "@/features/portfolio/hooks/usePortfolio";
import { usePortfolioTimeseries } from "@/features/portfolio/hooks/usePortfolioTimeseries";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { useCancelOrder } from "@/features/orders/hooks/useCancelOrder";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import type { OrderStatus } from "@/features/orders/types/orders";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

const STATUS_STYLES: Record<string, string> = {
  PENDING:          "bg-warning/10 text-warning",
  PARTIALLY_FILLED: "bg-primary/10 text-primary",
  FILLED:           "bg-success/10 text-success",
  CANCELLED:        "bg-muted text-muted-foreground",
  REJECTED:         "bg-destructive/10 text-destructive",
  EXPIRED:          "bg-muted text-muted-foreground",
};

type OrderTab = "ALL" | "PENDING" | "FILLED" | "CANCELLED";

const TAB_STATUSES: Record<OrderTab, OrderStatus[]> = {
  ALL:       ["PENDING", "PARTIALLY_FILLED", "FILLED", "CANCELLED", "REJECTED", "EXPIRED"],
  PENDING:   ["PENDING", "PARTIALLY_FILLED"],
  FILLED:    ["FILLED"],
  CANCELLED: ["CANCELLED", "REJECTED", "EXPIRED"],
};

const CANCELLABLE: OrderStatus[] = ["PENDING", "PARTIALLY_FILLED"];

export function PortfolioPage() {
  const { data: portfolio, isLoading, isError, error } = usePortfolio();
  const {
    data: portfolioTimeseries,
    isLoading: timeseriesLoading,
    isError: timeseriesError,
  } = usePortfolioTimeseries(30);
  const { data: ordersData, isLoading: ordersLoading } = useOrders({ limit: 50 });
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const [orderTab, setOrderTab] = useState<OrderTab>("ALL");
  const [search, setSearch] = useState("");

  const totalCost = portfolio?.holdings.reduce((sum, h) => sum + h.totalCost, 0) ?? 0;
  const primaryBalance = portfolio?.cashBalances.find((b) => b.currency === "USD");
  const availableBalance = primaryBalance?.availableBalance ?? 0;
  const pieData = portfolio?.holdings.map((h) => ({ name: h.ticker, value: h.totalCost })) ?? [];
  const timeseriesPoints = portfolioTimeseries?.points ?? [];
  const latestPoint = timeseriesPoints.length > 0
    ? timeseriesPoints[timeseriesPoints.length - 1]
    : undefined;

  const allowedStatuses = TAB_STATUSES[orderTab];
  const allOrders = ordersData?.orders ?? [];
  const filteredOrders = allOrders
    .filter((o) => allowedStatuses.includes(o.status as OrderStatus))
    .filter((o) =>
      search === "" ||
      o.instrumentId.toLowerCase().includes(search.toLowerCase()),
    );

  const pendingCount = allOrders.filter((o) =>
    TAB_STATUSES.PENDING.includes(o.status as OrderStatus),
  ).length;

  function handleCancel(orderId: string) {
    cancelOrder(orderId, {
      onSuccess: () => toast.success("Order cancelled"),
      onError: () => toast.error("Failed to cancel order"),
    });
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="mb-2">Portfolio</h1>
        <p className="text-muted-foreground">Track your holdings and performance</p>
      </div>

      {isError && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="size-5 shrink-0" />
          <span>{(error as Error).message}</span>
        </div>
      )}

      {/* Summary cards */}
      <div className="mb-8 grid gap-6 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 text-sm text-muted-foreground">Portfolio Value</div>
          {timeseriesLoading ? (
            <div className="h-7 w-32 animate-pulse rounded bg-muted" />
          ) : (
            <div className="mb-2">
              ${(latestPoint?.totalValue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          )}
          <div className="text-sm text-muted-foreground">Cash + stocks at market value</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 text-sm text-muted-foreground">Total Invested</div>
          {isLoading ? (
            <div className="h-7 w-32 animate-pulse rounded bg-muted" />
          ) : (
            <div className="mb-2">
              ${totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          )}
          <div className="text-sm text-muted-foreground">Cost basis</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 text-sm text-muted-foreground">Cash Balance</div>
          {isLoading ? (
            <div className="h-7 w-32 animate-pulse rounded bg-muted" />
          ) : (
            <div className="mb-2">
              ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          )}
          <div className="text-sm text-muted-foreground">Available to trade</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 text-sm text-muted-foreground">Active Positions</div>
          {isLoading ? (
            <div className="h-7 w-16 animate-pulse rounded bg-muted" />
          ) : (
            <div className="mb-2">{portfolio?.holdings.length ?? 0}</div>
          )}
          <div className="text-sm text-muted-foreground">Open holdings</div>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="mb-1">Portfolio Value</h3>
            <p className="text-sm text-muted-foreground">Last 30 days, stocks + wallet only</p>
          </div>
          {!timeseriesLoading && latestPoint && (
            <div className="text-sm text-muted-foreground">
              Current total:{" "}
              <span className="text-foreground">
                ${latestPoint.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>

        {timeseriesLoading && (
          <div className="h-[320px] animate-pulse rounded-lg bg-muted" />
        )}

        {!timeseriesLoading && timeseriesError && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="size-5 shrink-0" />
            <span>Failed to load portfolio history.</span>
          </div>
        )}

        {!timeseriesLoading && !timeseriesError && timeseriesPoints.length > 0 && (
          <ErrorBoundary fallback={<div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">Chart unavailable</div>}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={timeseriesPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  stroke="var(--muted-foreground)"
                  tickFormatter={(value: string) => value.slice(5)}
                />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                  formatter={(value, name) => [
                    `$${Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    name === "totalValue"
                      ? "Total value"
                      : name === "cashValue"
                        ? "Cash value"
                        : "Stocks value",
                  ]}
                />
                <Legend />
                <Line type="monotone" dataKey="totalValue" name="Total value" stroke="#2563eb" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="cashValue" name="Cash value" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="stocksValue" name="Stocks value" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ErrorBoundary>
        )}
      </div>

      {/* Holdings + allocation */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="mb-6">Holdings</h3>

          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          )}

          {!isLoading && portfolio?.holdings.length === 0 && (
            <p className="text-center text-muted-foreground">
              No holdings yet. Start trading to build your portfolio.
            </p>
          )}

          {!isLoading && (
            <div className="space-y-4">
              {portfolio?.holdings.map((holding) => {
                const allocation = totalCost > 0 ? (holding.totalCost / totalCost) * 100 : 0;
                return (
                  <Link
                    key={holding.ticker}
                    to={`/stock/${holding.ticker}`}
                    className="grid grid-cols-1 gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent md:grid-cols-2"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                        <span className="text-primary">{holding.ticker.slice(0, 2)}</span>
                      </div>
                      <div className="flex-1">
                        <div>{holding.ticker}</div>
                        <div className="text-sm text-muted-foreground">{holding.instrumentType}</div>
                        <div className="text-xs text-muted-foreground">
                          {holding.quantity} shares @ ${holding.averageCost.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end md:gap-8">
                      <div className="text-right">
                        <div>
                          ${holding.totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {allocation.toFixed(1)}% of portfolio
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-6">Allocation</h3>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : pieData.length > 0 ? (
            <>
              <ErrorBoundary fallback={<div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">Chart unavailable</div>}>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ErrorBoundary>
              <div className="mt-4 space-y-2">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-muted-foreground">{entry.name}</span>
                    </div>
                    <span className="text-foreground">
                      {totalCost > 0 ? ((entry.value / totalCost) * 100).toFixed(1) : "0.0"}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-sm text-muted-foreground">No holdings to display</p>
          )}
        </div>
      </div>

      {/* Order history */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3>Order History</h3>
          {/* Search */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by ticker…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-input bg-input-background py-2 pl-9 pr-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Status tabs */}
        <div className="mb-5 flex flex-wrap gap-2">
          {(["ALL", "PENDING", "FILLED", "CANCELLED"] as OrderTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setOrderTab(t)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                orderTab === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "ALL" ? "All" : t === "PENDING" ? `Pending${pendingCount > 0 ? ` (${pendingCount})` : ""}` : t === "FILLED" ? "Filled" : "Cancelled"}
            </button>
          ))}
        </div>

        {ordersLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        )}

        {!ordersLoading && filteredOrders.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No orders found
          </p>
        )}

        {!ordersLoading && filteredOrders.length > 0 && (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg text-xs font-medium ${
                      order.side === "BUY"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {order.side}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {order.instrumentId}
                      <span className="ml-2 text-xs text-muted-foreground">{order.orderType}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.quantity} shares
                      {order.limitPrice != null && ` @ $${Number(order.limitPrice).toFixed(2)}`}
                      {order.filledQuantity > 0 && ` · ${order.filledQuantity} filled`}
                      {order.averageFillPrice != null && ` @ $${Number(order.averageFillPrice).toFixed(2)}`}
                      {order.exchangeFee != null && order.exchangeFee > 0 && ` · fee $${Number(order.exchangeFee).toFixed(4)}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      STATUS_STYLES[order.status] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                  {CANCELLABLE.includes(order.status as OrderStatus) && (
                    <button
                      onClick={() => handleCancel(order.orderId)}
                      disabled={isCancelling}
                      title="Cancel order"
                      className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive disabled:opacity-50"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
