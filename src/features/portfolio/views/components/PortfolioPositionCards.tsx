import { BarChart2, FileText } from "lucide-react";
import type { Holding } from "@/features/portfolio/types/portfolio";
import { useNotifications } from "@/providers/NotificationProvider";

type Props = {
  holdings: Holding[];
  isLoading: boolean;
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

export function PortfolioPositionCards({ holdings, isLoading }: Props) {
  const { priceUpdates } = useNotifications();

  const stocks = holdings.filter((h) => h.instrumentType === "STOCK");
  const contracts = holdings.filter((h) => h.instrumentType !== "STOCK");

  const stockCost = stocks.reduce((s, h) => s + h.totalCost, 0);
  const contractCost = contracts.reduce((s, h) => s + h.totalCost, 0);

  const stockLiveValue = stocks.reduce((sum, h) => {
    const live = priceUpdates[h.ticker];
    return sum + (live ? live.price * h.quantity : 0);
  }, 0);
  const hasAnyStockLive = stocks.some((h) => priceUpdates[h.ticker]);
  const stockPnl = stockLiveValue - stockCost;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Stock positions */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Stock Positions</span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <BarChart2 className="size-4 text-primary" />
          </div>
        </div>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-7 w-12 animate-pulse rounded bg-muted" />
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>
        ) : (
          <>
            <p className="text-3xl font-bold tabular-nums">{stocks.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">${fmt(stockCost)} invested</p>
            {hasAnyStockLive && (
              <p className="mt-0.5 text-sm">
                <span className="text-muted-foreground">Live: </span>
                <span className="tabular-nums font-medium text-foreground">
                  ${fmt(stockLiveValue)}
                </span>
                <span
                  className={`ml-1.5 text-xs tabular-nums ${
                    stockPnl >= 0 ? "text-success" : "text-destructive"
                  }`}
                >
                  {stockPnl >= 0 ? "+" : "-"}${fmt(Math.abs(stockPnl))}
                </span>
              </p>
            )}
          </>
        )}
      </div>

      {/* Contract positions */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Contract Positions</span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/10">
            <FileText className="size-4 text-violet-400" />
          </div>
        </div>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-7 w-12 animate-pulse rounded bg-muted" />
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          </div>
        ) : (
          <>
            <p className="text-3xl font-bold tabular-nums">{contracts.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              ${fmt(contractCost)} invested
            </p>
          </>
        )}
      </div>
    </div>
  );
}
