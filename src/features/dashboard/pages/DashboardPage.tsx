import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  TrendingUp,
  Wallet,
} from "lucide-react";
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
import { mockNews, mockPortfolio } from "../model/mockData";

const portfolioData = [
  { date: "Mon", value: 48500 },
  { date: "Tue", value: 49200 },
  { date: "Wed", value: 48800 },
  { date: "Thu", value: 50100 },
  { date: "Fri", value: 51300 },
  { date: "Sat", value: 52100 },
  { date: "Sun", value: 52847 },
];

export function DashboardPage() {
  const totalValue = mockPortfolio.reduce(
    (sum, holding) => sum + holding.shares * holding.currentPrice,
    0,
  );
  const totalCost = mockPortfolio.reduce(
    (sum, holding) => sum + holding.shares * holding.avgPrice,
    0,
  );
  const totalGain = totalValue - totalCost;
  const totalGainPercent = (totalGain / totalCost) * 100;

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your portfolio overview
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Portfolio Value
            </span>
            <div className="rounded-lg bg-primary/10 p-2">
              <Wallet className="size-4 text-primary" />
            </div>
          </div>
          <div className="mb-1">
            ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div
            className={`flex items-center text-sm ${totalGain >= 0 ? "text-success" : "text-destructive"}`}
          >
            {totalGain >= 0 ? (
              <ArrowUpRight className="size-4" />
            ) : (
              <ArrowDownRight className="size-4" />
            )}
            <span>
              {totalGainPercent >= 0 ? "+" : ""}
              {totalGainPercent.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Total Gain/Loss
            </span>
            <div className="rounded-lg bg-success/10 p-2">
              <TrendingUp className="size-4 text-success" />
            </div>
          </div>
          <div className="mb-1">
            $
            {Math.abs(totalGain).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div
            className={`text-sm ${totalGain >= 0 ? "text-success" : "text-destructive"}`}
          >
            {totalGain >= 0 ? "Profit" : "Loss"}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Available Balance
            </span>
            <div className="rounded-lg bg-warning/10 p-2">
              <DollarSign className="size-4 text-warning" />
            </div>
          </div>
          <div className="mb-1">$12,450.00</div>
          <Link to="/wallet" className="text-sm text-primary hover:underline">
            Manage Wallet
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Active Positions
            </span>
            <div className="rounded-lg bg-chart-2/10 p-2">
              <Activity className="size-4 text-chart-2" />
            </div>
          </div>
          <div className="mb-1">{mockPortfolio.length}</div>
          <Link
            to="/portfolio"
            className="text-sm text-primary hover:underline"
          >
            View Portfolio
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="mb-6">Portfolio Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={portfolioData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="rgb(99, 102, 241)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="rgb(99, 102, 241)"
                    stopOpacity={0}
                  />
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
            {mockNews.slice(0, 5).map((news) => (
              <div
                key={news.id}
                className="border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="mb-1 line-clamp-2 text-sm text-foreground">
                  {news.title}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{news.source}</span>
                  <span>•</span>
                  <span>{news.time}</span>
                </div>
              </div>
            ))}
            <Link
              to="/news"
              className="block text-center text-sm text-primary hover:underline"
            >
              View All News
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-6">Top Holdings</h3>
        <div className="space-y-4">
          {mockPortfolio.slice(0, 5).map((holding) => {
            const value = holding.shares * holding.currentPrice;
            const gain =
              (holding.currentPrice - holding.avgPrice) * holding.shares;
            const gainPercent =
              ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) *
              100;

            return (
              <Link
                key={holding.symbol}
                to={`/stock/${holding.symbol}`}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-primary">
                      {holding.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div>{holding.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {holding.shares} shares
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div>
                    $
                    {value.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <div
                    className={`text-sm ${gain >= 0 ? "text-success" : "text-destructive"}`}
                  >
                    {gain >= 0 ? "+" : ""}${Math.abs(gain).toFixed(2)} (
                    {gainPercent >= 0 ? "+" : ""}
                    {gainPercent.toFixed(2)}%)
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
