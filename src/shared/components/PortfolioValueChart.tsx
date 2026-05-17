import { useId } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertCircle } from "lucide-react";
import { usePortfolioTimeseries } from "@/features/portfolio/hooks/usePortfolioTimeseries";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

function formatAxisDollar(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function formatFullDollar(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatTooltipDate(label: string): string {
  const d = new Date(`${label}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

type PortfolioValueChartProps = {
  days?: number;
};

export function PortfolioValueChart({ days = 30 }: PortfolioValueChartProps) {
  const uid = useId();
  const cashGradId = `pvc-cash-${uid}`;
  const stocksGradId = `pvc-stocks-${uid}`;

  const { data, isLoading, isError } = usePortfolioTimeseries(days);
  const points = (data?.points ?? []).map((p) => ({
    ...p,
    cashValue: Math.max(0, p.cashValue),
  }));
  const latest = points.length > 0 ? points[points.length - 1] : undefined;

  const xTickInterval = Math.max(0, Math.floor((points.length - 1) / 6));

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Portfolio Value</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {points.length > 0
              ? `Last ${points.length} day${points.length !== 1 ? "s" : ""}`
              : `Last ${days} days`}{" "}
            — cash &amp; stocks
          </p>
        </div>

        {!isLoading && latest && (
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ background: "var(--color-chart-4)" }}
              />
              <span className="text-muted-foreground">Cash</span>
              <span className="font-semibold tabular-nums">{formatFullDollar(latest.cashValue)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ background: "var(--color-chart-1)" }}
              />
              <span className="text-muted-foreground">Stocks</span>
              <span className="font-semibold tabular-nums">{formatFullDollar(latest.stocksValue)}</span>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="h-[280px] animate-pulse rounded-lg bg-muted" />
      )}

      {!isLoading && isError && (
        <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-center">
          <AlertCircle className="size-8 text-destructive/60" />
          <p className="text-sm font-medium text-destructive">Failed to load portfolio history</p>
          <p className="text-xs text-muted-foreground">Data is temporarily unavailable.</p>
        </div>
      )}

      {!isLoading && !isError && points.length === 0 && (
        <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
          No history available yet
        </div>
      )}

      {!isLoading && !isError && points.length > 0 && (
        <ErrorBoundary
          fallback={
            <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
              Chart unavailable
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={points} margin={{ top: 6, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={cashGradId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    style={{ stopColor: "var(--color-chart-4)", stopOpacity: 0.28 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "var(--color-chart-4)", stopOpacity: 0 }}
                  />
                </linearGradient>
                <linearGradient id={stocksGradId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    style={{ stopColor: "var(--color-chart-1)", stopOpacity: 0.22 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "var(--color-chart-1)", stopOpacity: 0 }}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                stroke="transparent"
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                tickFormatter={(v: string) => v.slice(5)}
                interval={xTickInterval}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                stroke="transparent"
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                tickFormatter={formatAxisDollar}
                width={56}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                }}
                labelStyle={{
                  color: "var(--color-muted-foreground)",
                  fontSize: 11,
                  marginBottom: 6,
                  fontWeight: 500,
                }}
                itemStyle={{ color: "var(--color-foreground)", padding: "2px 0" }}
                formatter={(value: unknown, name: unknown) => [
                  formatFullDollar(Number(value ?? 0)),
                  name === "cashValue" ? "Cash" : "Stocks",
                ]}
                labelFormatter={formatTooltipDate}
              />

              <Area
                type="monotone"
                dataKey="cashValue"
                name="cashValue"
                stroke="var(--color-chart-4)"
                strokeWidth={2}
                fill={`url(#${cashGradId})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: "var(--color-chart-4)" }}
              />

              <Area
                type="monotone"
                dataKey="stocksValue"
                name="stocksValue"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fill={`url(#${stocksGradId})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: "var(--color-chart-1)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ErrorBoundary>
      )}
    </div>
  );
}
