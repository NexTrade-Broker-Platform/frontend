import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertCircle } from "lucide-react";
import { usePortfolioTimeseries } from "@/features/portfolio/hooks/usePortfolioTimeseries";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

type PortfolioValueChartProps = {
  days?: number;
};

export function PortfolioValueChart({ days = 30 }: PortfolioValueChartProps) {
  const { data, isLoading, isError } = usePortfolioTimeseries(days);

  const points = data?.points ?? [];
  const latestPoint = points.length > 0 ? points[points.length - 1] : undefined;

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Portfolio Value</h2>
          <p className="text-sm text-muted-foreground">Last {days} days — cash + stocks</p>
        </div>
        {!isLoading && latestPoint && (
          <div className="text-sm text-muted-foreground">
            Current total:{" "}
            <span className="text-foreground">
              ${latestPoint.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>

      {isLoading && <div className="h-70 animate-pulse rounded-lg bg-muted" />}

      {!isLoading && isError && (
        <div className="flex h-70 flex-col items-center justify-center gap-2 text-center">
          <AlertCircle className="size-8 text-destructive/60" />
          <p className="text-sm font-medium text-destructive">Failed to load portfolio history</p>
          <p className="text-xs text-muted-foreground">Data is temporarily unavailable.</p>
        </div>
      )}

      {!isLoading && !isError && points.length > 0 && (
        <ErrorBoundary
          fallback={
            <div className="flex h-70 items-center justify-center text-sm text-muted-foreground">
              Chart unavailable
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={points}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="date"
                stroke="var(--color-muted-foreground)"
                tick={{ fontSize: 12 }}
                tickFormatter={(v: string) => v.slice(5)}
              />
              <YAxis stroke="var(--color-muted-foreground)" tick={{ fontSize: 12 }} width={60} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                formatter={(value, name) => [
                  `$${Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  name === "totalValue" ? "Total" : name === "cashValue" ? "Cash" : "Stocks",
                ]}
              />
              <Legend />
              <Line type="monotone" dataKey="totalValue" name="Total" stroke="var(--color-primary)" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="cashValue" name="Cash" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="stocksValue" name="Stocks" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ErrorBoundary>
      )}

      {!isLoading && !isError && points.length === 0 && (
        <div className="flex h-70 items-center justify-center text-sm text-muted-foreground">
          No history available yet
        </div>
      )}
    </div>
  );
}
