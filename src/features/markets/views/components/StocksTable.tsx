import { memo, useMemo } from "react";
import { useNavigate } from "react-router";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Stock } from "@/features/markets/types/markets";
import type { PriceUpdate } from "@/providers/NotificationProvider";
import { useWsSparklines } from "@/features/markets/hooks/useWsSparklines";
import { StockSparkline, type SparklinePoint } from "./StockSparkline";

type StockRowProps = {
  stock: Stock;
  live: PriceUpdate | undefined;
  sparklineData: SparklinePoint[];
  sparklineProfit: boolean;
};

const StockRow = memo(function StockRow({ stock, live, sparklineData, sparklineProfit }: StockRowProps) {
  const navigate = useNavigate();
  const price = live?.price ?? stock.currentPrice;
  const change = live?.change ?? stock.change;
  const changePct = live?.change_pct ?? stock.changePercent;
  const isProfit = change >= 0;

  return (
    <tr
      onClick={() => navigate(`/stock/${stock.ticker}`)}
      className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-accent"
    >
      <td className="px-6 py-4 font-medium text-primary">{stock.ticker}</td>
      <td className="px-6 py-4 text-foreground">{stock.name}</td>
      <td className="px-6 py-4">
        <StockSparkline data={sparklineData} isProfit={sparklineProfit} />
      </td>
      <td className="px-6 py-4 text-right">
        <span className="text-foreground">${price.toFixed(2)}</span>
        {live && <span className="ml-2 inline-block size-1.5 rounded-full bg-success align-middle" />}
      </td>
      <td className="px-6 py-4 text-right">
        <div className={`flex items-center justify-end gap-1 ${isProfit ? "text-success" : "text-destructive"}`}>
          {isProfit ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
          <span>
            {isProfit ? "+" : ""}{change.toFixed(2)} ({changePct >= 0 ? "+" : ""}{changePct.toFixed(2)}%)
          </span>
        </div>
      </td>
    </tr>
  );
});

type StocksTableProps = {
  stocks: Stock[];
  isLoading: boolean;
  priceUpdates: Record<string, PriceUpdate>;
};

// A flat green line: stable reference, never changes
const FLATLINE: SparklinePoint[] = [{ value: 0 }, { value: 0 }];

export function StocksTable({ stocks, isLoading, priceUpdates }: StocksTableProps) {
  const wsSparklines = useWsSparklines();

  const rows = useMemo(() =>
    stocks.map((stock) => {
      const live = priceUpdates[stock.ticker];
      const history = wsSparklines[stock.ticker];
      // Green if up vs first WS tick, green if no data yet (flatline)
      const sparklineProfit = history
        ? history[history.length - 1].value >= history[0].value
        : true;
      return { stock, live, sparklineData: history ?? FLATLINE, sparklineProfit };
    }),
  [stocks, priceUpdates, wsSparklines]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-muted-foreground">Ticker</th>
              <th className="px-6 py-4 text-left text-sm text-muted-foreground">Name</th>
              <th className="px-6 py-4 text-left text-sm text-muted-foreground">Today</th>
              <th className="px-6 py-4 text-right text-sm text-muted-foreground">Price</th>
              <th className="px-6 py-4 text-right text-sm text-muted-foreground">Change</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading &&
              rows.map(({ stock, live, sparklineData, sparklineProfit }) => (
                <StockRow
                  key={stock.ticker}
                  stock={stock}
                  live={live}
                  sparklineData={sparklineData}
                  sparklineProfit={sparklineProfit}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
