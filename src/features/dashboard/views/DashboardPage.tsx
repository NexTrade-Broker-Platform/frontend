import { Activity, DollarSign, Loader2, TrendingUp, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router";
import { usePortfolio } from "@/features/portfolio/hooks/usePortfolio";

const portfolioChartData = [
  { date: "Mon", value: 48500 },
  { date: "Tue", value: 49200 },
  { date: "Wed", value: 48800 },
  { date: "Thu", value: 50100 },
  { date: "Fri", value: 51300 },
  { date: "Sat", value: 52100 },
  { date: "Sun", value: 52847 },
];

const recentNews = [
  { id: "1", title: "Fed Signals Potential Rate Cut in Coming Months", source: "Financial Times", time: "2h ago" },
  { id: "2", title: "Tech Stocks Rally on Strong Earnings Reports", source: "Bloomberg", time: "4h ago" },
  { id: "3", title: "Oil Prices Surge Amid Middle East Tensions", source: "Reuters", time: "5h ago" },
  { id: "4", title: "Apple Announces New AI Features for iPhone", source: "CNBC", time: "6h ago" },
  { id: "5", title: "European Markets Close Higher on Economic Data", source: "WSJ", time: "7h ago" },
];

export function DashboardPage() {
  const { data: portfolio, isLoading } = usePortfolio();

  const totalCost = portfolio?.holdings.reduce((sum, h) => sum + h.totalCost, 0) ?? 0;
  const holdingsCount = portfolio?.holdings.length ?? 0;
  const primaryBalance = portfolio?.cashBalances.find((b) => b.currency === "USD");
  const availableBalance = primaryBalance?.availableBalance ?? 0;

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s your portfolio overview</p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Invested</span>
            <div className="rounded-lg bg-primary/10 p-2">
              <Wallet className="size-4 text-primary" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-7 w-28 animate-pulse rounded bg-muted" />
          ) : (
            <div className="mb-1">
              ${totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          )}
          <div className="text-sm text-muted-foreground">Cost basis</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Cash Balance</span>
            <div className="rounded-lg bg-success/10 p-2">
              <DollarSign className="size-4 text-success" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-7 w-28 animate-pulse rounded bg-muted" />
          ) : (
            <div className="mb-1">
              ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          )}
          <Link to="/wallet" className="text-sm text-primary hover:underline">
            Manage Wallet
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Active Positions</span>
            <div className="rounded-lg bg-chart-2/10 p-2">
              <Activity className="size-4 text-chart-2" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-7 w-12 animate-pulse rounded bg-muted" />
          ) : (
            <div className="mb-1">{holdingsCount}</div>
          )}
          <Link to="/portfolio" className="text-sm text-primary hover:underline">
            View Portfolio
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Markets</span>
            <div className="rounded-lg bg-warning/10 p-2">
              <TrendingUp className="size-4 text-warning" />
            </div>
          </div>
          <div className="mb-1">Live</div>
          <Link to="/markets" className="text-sm text-primary hover:underline">
            Browse Markets
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="mb-6">Portfolio Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={portfolioChartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(99, 102, 241)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="rgb(99, 102, 241)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="rgb(99, 102, 241)"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-6">Market News</h3>
          <div className="space-y-4">
            {recentNews.map((news) => (
              <div key={news.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="mb-1 line-clamp-2 text-sm text-foreground">{news.title}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{news.source}</span>
                  <span>•</span>
                  <span>{news.time}</span>
                </div>
              </div>
            ))}
            <Link to="/news" className="block text-center text-sm text-primary hover:underline">
              View All News
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-6">Top Holdings</h3>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : portfolio?.holdings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
            <Loader2 className="size-8 opacity-30" />
            <p>No holdings yet.</p>
            <Link to="/markets" className="text-sm text-primary hover:underline">
              Browse Markets to start trading
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {portfolio?.holdings.slice(0, 5).map((holding) => (
              <Link
                key={holding.ticker}
                to={`/stock/${holding.ticker}`}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-primary">{holding.ticker.slice(0, 2)}</span>
                  </div>
                  <div>
                    <div>{holding.ticker}</div>
                    <div className="text-sm text-muted-foreground">{holding.quantity} shares</div>
                  </div>
                </div>
                <div className="text-right">
                  <div>
                    ${holding.totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    avg ${holding.averageCost.toFixed(2)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
