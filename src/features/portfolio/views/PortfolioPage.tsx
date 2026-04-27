import { AlertCircle, Loader2 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { usePortfolio } from "@/features/portfolio/hooks/usePortfolio";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

export function PortfolioPage() {
  const { data: portfolio, isLoading, isError, error } = usePortfolio();

  const totalCost =
    portfolio?.holdings.reduce((sum, h) => sum + h.totalCost, 0) ?? 0;

  const primaryBalance = portfolio?.cashBalances.find((b) => b.currency === "USD");
  const availableBalance = primaryBalance?.availableBalance ?? 0;

  const pieData =
    portfolio?.holdings.map((h) => ({ name: h.ticker, value: h.totalCost })) ?? [];

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

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
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

      <div className="grid gap-6 lg:grid-cols-3">
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
            <p className="text-center text-muted-foreground">No holdings yet. Start trading to build your portfolio.</p>
          )}

          {!isLoading && (
            <div className="space-y-4">
              {portfolio?.holdings.map((holding) => {
                const allocation = totalCost > 0 ? (holding.totalCost / totalCost) * 100 : 0;
                return (
                  <div
                    key={holding.ticker}
                    className="grid grid-cols-1 gap-4 rounded-lg border border-border p-4 md:grid-cols-2"
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
                  </div>
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
    </div>
  );
}
