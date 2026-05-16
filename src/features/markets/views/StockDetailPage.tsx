import { useState } from "react";
import React from "react";
import { Link, useParams } from "react-router";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { useStockDetail } from "@/features/markets/hooks/useStockDetail";
import { useMarketStatus } from "@/features/markets/hooks/useMarketStatus";
import { usePlaceOrder } from "@/features/orders/hooks/usePlaceOrder";
import { useLivePrice } from "@/providers/NotificationProvider";
import { StockPriceChart } from "@/features/markets/views/components/StockPriceChart";
import { MarketClock } from "@/features/markets/views/components/MarketClock";
import type { InstrumentType, OrderSide, OrderType } from "@/features/orders/types/orders";

export function StockDetailPage() {
  const { ticker } = useParams<{ ticker: string }>();
  const { data: stockDetail, isLoading, isError, error } = useStockDetail(ticker!);
  const { mutate: placeOrder, isPending: isPlacing } = usePlaceOrder();
  const livePrice = useLivePrice(ticker!);
  const { data: marketStatus, dataUpdatedAt } = useMarketStatus();

  const [orderType, setOrderType] = useState<OrderType>("MARKET");
  const [side, setSide] = useState<OrderSide>("BUY");
  const [quantity, setQuantity] = useState("");
  const [limitPrice, setLimitPrice] = useState("");

  const stock = stockDetail?.stock;

  const price = livePrice?.price ?? stock?.currentPrice ?? 0;
  const change = livePrice?.change ?? stock?.change ?? 0;
  const changePct = livePrice?.change_pct ?? stock?.changePercent ?? 0;

  const handleSubmitOrder = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!stock) return;
    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    if (orderType === "LIMIT" && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      toast.error("Please enter a valid limit price");
      return;
    }

    placeOrder(
      {
        instrumentType: "STOCK" as InstrumentType,
        instrumentId: stock.ticker,
        orderType,
        side,
        quantity: qty,
        limitPrice: orderType === "LIMIT" ? parseFloat(limitPrice) : undefined,
      },
      {
        onSuccess: (order) => {
          toast.success(
            `${side === "BUY" ? "Buy" : "Sell"} order placed for ${qty} × ${stock.ticker} (${order.status})`,
          );
          setQuantity("");
          setLimitPrice("");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

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
            Back to Markets
          </Link>
        </div>
      </div>
    );
  }

  const estimatedTotal =
    (parseInt(quantity, 10) || 0) *
    (orderType === "MARKET" ? price : parseFloat(limitPrice) || 0);

  return (
    <div className="p-4 lg:p-8">
      <Link
        to="/markets"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Markets
      </Link>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-3">
              <h1>{stock.ticker}</h1>
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                {stock.sector}
              </span>
              {livePrice && (
                <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                  <span className="size-1.5 animate-pulse rounded-full bg-success" />
                  Live
                </span>
              )}
            </div>
            <p className="text-muted-foreground">{stock.name}</p>
          </div>

          <div className="mb-6 flex items-end gap-4">
            <div>
              <div className="mb-1 text-4xl">${price.toFixed(2)}</div>
              <div
                className={`flex items-center gap-1 ${
                  change >= 0 ? "text-success" : "text-destructive"
                }`}
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
              {marketStatus?.marketTime && (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className={`size-1.5 rounded-full ${
                      marketStatus.exchangeConnected ? "animate-pulse bg-success" : "bg-muted-foreground/50"
                    }`}
                  />
                  <span>{marketStatus.exchangeConnected ? "Market Open" : "Market Closed"}</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="font-mono">
                    <MarketClock
                      marketTime={marketStatus.marketTime}
                      speedMultiplier={marketStatus.speedMultiplier ?? 1}
                      fetchedAt={dataUpdatedAt}
                    />
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-1 text-sm text-muted-foreground">Volume</div>
              <div className="text-foreground">
                {(livePrice?.volume ?? stock.volume).toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-1 text-sm text-muted-foreground">Open</div>
              <div className="text-foreground">${stock.openPrice.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-1 text-sm text-muted-foreground">High</div>
              <div className="text-success">${stock.highPrice.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-1 text-sm text-muted-foreground">Low</div>
              <div className="text-destructive">${stock.lowPrice.toFixed(2)}</div>
            </div>
          </div>

          <StockPriceChart ticker={stock.ticker} change={change} />
        </div>

        <div>
          <div className="sticky top-8 rounded-xl border border-border bg-card p-6">
            <h3 className="mb-6">Place Order</h3>

            <div className="mb-4 inline-flex w-full rounded-lg border border-border bg-muted/50 p-1">
              <button
                onClick={() => setSide("BUY")}
                className={`flex-1 rounded-md px-4 py-2 transition-colors ${
                  side === "BUY"
                    ? "bg-success text-success-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setSide("SELL")}
                className={`flex-1 rounded-md px-4 py-2 transition-colors ${
                  side === "SELL"
                    ? "bg-destructive text-destructive-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sell
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-foreground">Order Type</label>
                <div className="inline-flex w-full rounded-lg border border-border bg-muted/50 p-1">
                  <button
                    type="button"
                    onClick={() => setOrderType("MARKET")}
                    className={`flex-1 rounded-md px-4 py-2 text-sm transition-colors ${
                      orderType === "MARKET"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Market
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType("LIMIT")}
                    className={`flex-1 rounded-md px-4 py-2 text-sm transition-colors ${
                      orderType === "LIMIT"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Limit
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="quantity" className="mb-2 block text-sm text-foreground">
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-lg border border-input bg-input-background px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter quantity"
                  required
                />
              </div>

              {orderType === "LIMIT" && (
                <div>
                  <label htmlFor="limitPrice" className="mb-2 block text-sm text-foreground">
                    Limit Price
                  </label>
                  <input
                    id="limitPrice"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    className="w-full rounded-lg border border-input bg-input-background px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter limit price"
                    required
                  />
                </div>
              )}

              {quantity && (
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Total</span>
                    <span className="text-foreground">${estimatedTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Price per share</span>
                    <span className="text-foreground">
                      $
                      {orderType === "MARKET"
                        ? price.toFixed(2)
                        : (parseFloat(limitPrice) || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isPlacing}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${
                  side === "BUY" ? "bg-success" : "bg-destructive"
                }`}
              >
                {isPlacing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : side === "BUY" ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}
                {isPlacing ? "Placing…" : `${side === "BUY" ? "Buy" : "Sell"} ${stock.ticker}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
