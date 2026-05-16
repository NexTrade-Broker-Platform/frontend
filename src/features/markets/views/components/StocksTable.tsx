import { Link } from "react-router";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Stock } from "@/features/markets/types/markets";
import type { PriceUpdate } from "@/providers/NotificationProvider";

type StocksTableProps = {
  stocks: Stock[];
  isLoading: boolean;
  priceUpdates: Record<string, PriceUpdate>;
};

export function StocksTable({ stocks, isLoading, priceUpdates }: StocksTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-muted-foreground">Ticker</th>
              <th className="px-6 py-4 text-left text-sm text-muted-foreground">Name</th>
              <th className="px-6 py-4 text-left text-sm text-muted-foreground">Sector</th>
              <th className="px-6 py-4 text-right text-sm text-muted-foreground">Price</th>
              <th className="px-6 py-4 text-right text-sm text-muted-foreground">Change</th>
              <th className="px-6 py-4 text-right text-sm text-muted-foreground">Volume</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading &&
              stocks.map((stock) => {
                const live = priceUpdates[stock.ticker];
                const price = live?.price ?? stock.currentPrice;
                const change = live?.change ?? stock.change;
                const changePct = live?.change_pct ?? stock.changePercent;
                const volume = live?.volume ?? stock.volume;

                return (
                  <tr
                    key={stock.ticker}
                    className="border-b border-border transition-colors last:border-0 hover:bg-accent"
                  >
                    <td className="px-6 py-4">
                      <Link to={`/stock/${stock.ticker}`} className="font-medium text-primary hover:underline">
                        {stock.ticker}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-foreground">{stock.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                        {stock.sector}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-foreground">${price.toFixed(2)}</span>
                      {live && (
                        <span className="ml-2 inline-block size-1.5 rounded-full bg-success align-middle" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className={`flex items-center justify-end gap-1 ${
                          change >= 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        {change >= 0 ? (
                          <ArrowUpRight className="size-4" />
                        ) : (
                          <ArrowDownRight className="size-4" />
                        )}
                        <span>
                          {change >= 0 ? "+" : ""}
                          {change.toFixed(2)} ({changePct >= 0 ? "+" : ""}
                          {changePct.toFixed(2)}%)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      {volume.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
