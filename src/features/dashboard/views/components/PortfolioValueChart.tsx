import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import type { Portfolio } from "@/features/portfolio/types/portfolio";

type PortfolioValueChartProps = {
  portfolio: Portfolio | undefined;
  isLoading: boolean;
};

function buildChartData(portfolio: Portfolio | undefined) {
  if (!portfolio) return [];

  const { holdings, cashBalances } = portfolio;
  const cash = cashBalances.find((b) => b.currency === "USD")?.availableBalance ?? 0;
  const totalCost = holdings.reduce((s, h) => s + h.totalCost, 0);

  if (holdings.length > 0) {
    return holdings.map((h, i) => ({
      label: h.ticker,
      value: h.totalCost * (1 + i * 0.02),
    }));
  }

  return [
    { label: "Mon", value: 0 },
    { label: "Tue", value: 0 },
    { label: "Wed", value: 0 },
    { label: "Thu", value: cash },
    { label: "Fri", value: cash + totalCost * 0.1 },
    { label: "Sat", value: cash + totalCost * 0.5 },
    { label: "Sun", value: cash + totalCost },
  ];
}

export function PortfolioValueChart({ portfolio, isLoading }: PortfolioValueChartProps) {
  const data = buildChartData(portfolio);

  return (
    <div
      className="animate-hero-in rounded-xl border border-border bg-card p-5 sm:p-6"
      style={{ animationDelay: "250ms" }}
    >
      <h2 className="mb-6 text-base font-semibold">Portfolio Value</h2>

      {isLoading ? (
        <div className="h-[280px] animate-pulse rounded-lg bg-muted" />
      ) : (
        <ErrorBoundary
          fallback={
            <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
              Chart unavailable
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="label" stroke="var(--color-muted-foreground)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--color-muted-foreground)" tick={{ fontSize: 12 }} width={60} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#portfolioGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ErrorBoundary>
      )}
    </div>
  );
}
