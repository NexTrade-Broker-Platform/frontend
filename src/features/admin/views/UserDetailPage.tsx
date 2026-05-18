import { useParams, Link } from "react-router";
import { useAdminUserDetail } from "@/features/admin/hooks/useAdminUserDetail";
import { FadeIn } from "@/shared/components/FadeIn";
import { Loader2, ArrowLeft, Wallet, Briefcase, History, TrendingUp, User as UserIcon, ArrowUpRight, ArrowDownLeft, Clock, Calendar as CalendarIcon } from "lucide-react";
import { UserOrderCharts } from "./components/UserOrderCharts";

export function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: user, isLoading, isError, error } = useAdminUserDetail(userId!);

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
        <p>Error loading user details: {(error as Error).message}</p>
      </div>
    );
  }

  const totalPortfolioValue = (user?.portfolio.holdings || []).reduce(
    (acc, holding) => acc + (holding.quantity || 0) * (holding.currentPrice || 0),
    0
  );

  const totalCashValue = (user?.wallets || []).reduce(
    (acc, wallet) => acc + (wallet.availableBalance || 0) + (wallet.reservedBalance || 0),
    0
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <FadeIn>
        <div className="mb-8">
          <Link
            to="/admin/users"
            className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Users
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <UserIcon className="size-8" />
              </div>
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-widest text-destructive">
                  User Management
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                  {user?.info?.firstName} {user?.info?.lastName}
                </h1>
                <div className="mt-1 flex items-center gap-3">
                  <span className="font-mono text-sm text-muted-foreground">@{user?.info?.username || "unknown"}</span>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="font-mono text-xs text-muted-foreground">{userId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Summary Cards */}
      <FadeIn delay={100}>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Assets</span>
              <div className="rounded-xl bg-primary/10 p-2">
                <TrendingUp className="size-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold tabular-nums">
              ${(totalPortfolioValue + totalCashValue).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cash Balance</span>
              <div className="rounded-xl bg-success/10 p-2">
                <Wallet className="size-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold tabular-nums">
              ${totalCashValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Stock Value</span>
              <div className="rounded-xl bg-chart-1/10 p-2">
                <Briefcase className="size-5 text-chart-1" />
              </div>
            </div>
            <p className="text-2xl font-bold tabular-nums">
              ${totalPortfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Orders</span>
              <div className="rounded-xl bg-violet-500/10 p-2">
                <History className="size-5 text-violet-400" />
              </div>
            </div>
            <p className="text-2xl font-bold tabular-nums">{user?.orders.length || 0}</p>
          </div>
        </div>
      </FadeIn>

      {/* Analytics Section */}
      {user && user.orders.length > 0 && (
        <FadeIn delay={150}>
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold">Activity Analytics</h2>
            <UserOrderCharts orders={user.orders} />
          </div>
        </FadeIn>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Portfolio Section */}
        <FadeIn delay={200} className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold">Current Portfolio</h2>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                {user?.portfolio.holdings.length || 0} Holdings
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3">Instrument</th>
                    <th className="px-6 py-3 text-right">Quantity</th>
                    <th className="px-6 py-3 text-right">Avg Price</th>
                    <th className="px-6 py-3 text-right">Current Price</th>
                    <th className="px-6 py-3 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {user?.portfolio.holdings.map((holding) => (
                    <tr key={holding.ticker} className="transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">{holding.ticker}</span>
                          <span className="text-[10px] uppercase text-muted-foreground">{holding.instrumentType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-medium">
                        {holding.quantity.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs text-muted-foreground">
                        ${(holding.averagePrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        ${(holding.currentPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-foreground">
                        ${((holding.quantity || 0) * (holding.currentPrice || 0)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                  {(!user?.portfolio.holdings || user.portfolio.holdings.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        No active holdings
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>

        {/* Wallets Section */}
        <FadeIn delay={300}>
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-bold">Cash Balances</h2>
              </div>
              <div className="divide-y divide-border p-6 pt-0">
                {user?.wallets.map((wallet) => (
                  <div key={wallet.currency} className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-bold text-foreground">{wallet.currency}</p>
                      <p className="text-xs text-muted-foreground">
                        Reserved: ${wallet.reservedBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <p className="text-xl font-bold tabular-nums text-foreground">
                      ${wallet.availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
               <h3 className="mb-2 text-sm font-bold text-muted-foreground uppercase">Bot Status</h3>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`size-3 rounded-full ${user?.info?.isBotRunning ? 'bg-success animate-pulse' : 'bg-muted'}`} />
                    <span className="font-semibold">{user?.info?.isBotRunning ? 'Currently Active' : 'Inactive'}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Trading Session</span>
               </div>
            </div>
          </div>
        </FadeIn>

        {/* Order History Section */}
        <FadeIn delay={400} className="lg:col-span-3">
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold">Recent Order History</h2>
              <Link to={`/admin/users/${userId}/orders`} className="text-xs text-primary hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 text-center">Side</th>
                    <th className="px-6 py-3">Instrument</th>
                    <th className="px-6 py-3 text-right">Quantity</th>
                    <th className="px-6 py-3 text-right">Price</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {user?.orders.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10).map((order) => (
                    <tr key={order.orderId} className="transition-colors hover:bg-muted/30">
                       <td className="px-6 py-4 text-center">
                        {order.side === "BUY" ? (
                          <div className="mx-auto flex size-7 items-center justify-center rounded-lg bg-success/10 text-success">
                            <ArrowUpRight className="size-3.5" />
                          </div>
                        ) : (
                          <div className="mx-auto flex size-7 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                            <ArrowDownLeft className="size-3.5" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{order.instrumentId}</span>
                          <span className="rounded bg-muted px-1 py-0.5 text-[9px] font-bold text-muted-foreground">
                            {order.orderType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        {(order.filledQuantity || 0).toLocaleString()} / {(order.quantity || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        ${(order.averageFillPrice || order.limitPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-muted-foreground">
                        <div className="flex flex-col items-end">
                           <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                           <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!user?.orders || user.orders.length === 0) && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        No order history
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      </div>
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
