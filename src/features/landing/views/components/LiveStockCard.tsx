import { TrendingUp, TrendingDown } from "lucide-react";
import { useLivePrice } from "@/providers/NotificationProvider";

type LiveStockCardProps = {
  ticker: string;
};

export function LiveStockCard({ ticker }: LiveStockCardProps) {
  const live = useLivePrice(ticker);

  if (!live) return null;

  const isPositive = live.change_pct >= 0;

  return (
    <article className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3 transition-colors hover:bg-muted/60">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
          {ticker.slice(0, 2)}
        </div>
        <p className="text-sm font-semibold">{ticker}</p>
      </div>
      <div className="ml-4 shrink-0 text-right">
        <p className="text-sm font-semibold tabular-nums">${live.price.toFixed(2)}</p>
        <p
          className={`flex items-center justify-end gap-0.5 text-xs font-medium tabular-nums ${
            isPositive ? "text-success" : "text-destructive"
          }`}
        >
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {isPositive ? "+" : ""}
          {live.change_pct.toFixed(2)}%
        </p>
      </div>
    </article>
  );
}
