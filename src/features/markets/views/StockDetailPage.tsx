import { Link, useParams } from "react-router";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { useStockDetail } from "@/features/markets/hooks/useStockDetail";
import { useLivePrice } from "@/providers/NotificationProvider";
import { FadeIn } from "@/shared/components/FadeIn";
import { StockPriceChart } from "@/features/markets/views/components/StockPriceChart";
import { OrderPanel } from "@/features/markets/views/components/OrderPanel";

export function StockDetailPage() {
  const { ticker } = useParams<{ ticker: string }>();
  const {
    data: stockDetail,
    isLoading,
    isError,
    error,
  } = useStockDetail(ticker!);
  const livePrice = useLivePrice(ticker!);

  const stock = stockDetail?.stock;

  const price = livePrice?.price ?? stock?.currentPrice ?? 0;
  const change = livePrice?.change ?? stock?.change ?? 0;
  const changePct = livePrice?.change_pct ?? stock?.changePercent ?? 0;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !stock) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-3 size-10 text-destructive" />
          <p className="mb-4 text-muted-foreground">
            {(error as Error)?.message ?? "Stock not found"}
          </p>
          <Link to="/markets" className="text-primary hover:underline">
            Back to Market
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <FadeIn>
        <Link
          to="/markets"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Market
        </Link>
      </FadeIn>

      {/* Page grid: 2/3 main + 1/3 order panel on desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Header */}
          <FadeIn delay={75}>
            <div className="mb-6">
              <div className="mb-1 flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="min-w-0 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {stock.name}
                </span>
                <span className="text-2xl font-bold tracking-tight text-muted-foreground/40 sm:text-4xl">
                  ·
                </span>
                <span className="text-2xl font-bold tracking-tight text-muted-foreground sm:text-4xl">
                  {stock.ticker}
                </span>
                {livePrice && (
                  <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                    <span className="size-1.5 animate-pulse rounded-full bg-success" />
                    Live
                  </span>
                )}
              </div>
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                {stock.sector}
              </span>
            </div>
          </FadeIn>

          {/* Price */}
          <FadeIn delay={150}>
            <div className="mb-6">
              <div className="mb-1 text-3xl font-bold sm:text-4xl">
                ${price.toFixed(2)}
              </div>
              <div
                className={`flex items-center gap-1 ${change >= 0 ? "text-success" : "text-destructive"}`}
              >
                {change >= 0 ? (
                  <ArrowUpRight className="size-5" />
                ) : (
                  <ArrowDownRight className="size-5" />
                )}
                <span>
                  {change >= 0 ? "+" : ""}
                  {change.toFixed(2)} ({changePct >= 0 ? "+" : ""}
                  {changePct.toFixed(2)}%)
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Chart */}
          <FadeIn delay={225}>
            <div className="mb-4">
              <StockPriceChart ticker={stock.ticker} change={change} />
            </div>
          </FadeIn>

          {/* Stat bar */}
          <FadeIn delay={300}>
            <div className="flex divide-x divide-border overflow-x-auto rounded-xl border border-border bg-card">
              <div className="flex flex-1 flex-col px-4 py-3">
                <span className="mb-0.5 text-xs text-muted-foreground">
                  Volume
                </span>
                <span className="text-sm font-medium text-foreground">
                  {(livePrice?.volume ?? stock.volume).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-1 flex-col px-4 py-3">
                <span className="mb-0.5 text-xs text-muted-foreground">
                  Open
                </span>
                <span className="text-sm font-medium text-foreground">
                  ${stock.openPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-1 flex-col px-4 py-3">
                <span className="mb-0.5 text-xs text-muted-foreground">
                  High
                </span>
                <span className="text-sm font-medium text-success">
                  ${stock.highPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-1 flex-col px-4 py-3">
                <span className="mb-0.5 text-xs text-muted-foreground">
                  Low
                </span>
                <span className="text-sm font-medium text-destructive">
                  ${stock.lowPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Order panel — sticky on desktop, hidden on mobile (shown below) */}
        <div className="hidden lg:block">
          <FadeIn delay={150}>
            <div className="sticky top-8">
              <OrderPanel ticker={stock.ticker} price={price} />
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Order panel — mobile only, below the chart */}
      <FadeIn delay={375} className="mt-6 lg:hidden">
        <OrderPanel ticker={stock.ticker} price={price} />
      </FadeIn>
    </div>
  );
}
