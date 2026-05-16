import { useState } from "react";
import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { usePlaceOrder } from "@/features/orders/hooks/usePlaceOrder";
import type { InstrumentType, OrderSide, OrderType } from "@/features/orders/types/orders";

type Props = {
  ticker: string;
  price: number;
};

export function OrderPanel({ ticker, price }: Props) {
  const { mutate: placeOrder, isPending: isPlacing } = usePlaceOrder();

  const [side,       setSide]       = useState<OrderSide>("BUY");
  const [orderType,  setOrderType]  = useState<OrderType>("MARKET");
  const [quantity,   setQuantity]   = useState("");
  const [limitPrice, setLimitPrice] = useState("");

  const estimatedTotal =
    (parseInt(quantity, 10) || 0) *
    (orderType === "MARKET" ? price : parseFloat(limitPrice) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) { toast.error("Please enter a valid quantity"); return; }
    if (orderType === "LIMIT" && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      toast.error("Please enter a valid limit price");
      return;
    }
    placeOrder(
      {
        instrumentType: "STOCK" as InstrumentType,
        instrumentId: ticker,
        orderType,
        side,
        quantity: qty,
        limitPrice: orderType === "LIMIT" ? parseFloat(limitPrice) : undefined,
      },
      {
        onSuccess: (order) => {
          toast.success(`${side === "BUY" ? "Buy" : "Sell"} order placed for ${qty} × ${ticker} (${order.status})`);
          setQuantity("");
          setLimitPrice("");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-6">Place Order</h3>

      {/* Buy / Sell toggle */}
      <div className="mb-4 inline-flex w-full rounded-lg border border-border bg-muted/50 p-1">
        <button
          onClick={() => setSide("BUY")}
          className={`flex-1 rounded-md px-4 py-2 transition-colors ${
            side === "BUY" ? "bg-success text-success-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide("SELL")}
          className={`flex-1 rounded-md px-4 py-2 transition-colors ${
            side === "SELL" ? "bg-destructive text-destructive-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sell
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order type */}
        <div>
          <label className="mb-2 block text-sm text-foreground">Order Type</label>
          <div className="inline-flex w-full rounded-lg border border-border bg-muted/50 p-1">
            <button
              type="button"
              onClick={() => setOrderType("MARKET")}
              className={`flex-1 rounded-md px-4 py-2 text-sm transition-colors ${
                orderType === "MARKET" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Market
            </button>
            <button
              type="button"
              onClick={() => setOrderType("LIMIT")}
              className={`flex-1 rounded-md px-4 py-2 text-sm transition-colors ${
                orderType === "LIMIT" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Limit
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="op-quantity" className="mb-2 block text-sm text-foreground">Quantity</label>
          <input
            id="op-quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full rounded-lg border border-input bg-input-background px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Limit price */}
        {orderType === "LIMIT" && (
          <div>
            <label htmlFor="op-limit" className="mb-2 block text-sm text-foreground">Limit Price</label>
            <input
              id="op-limit"
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

        {/* Summary */}
        {quantity && (
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated Total</span>
              <span className="text-foreground">${estimatedTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Price per share</span>
              <span className="text-foreground">
                ${orderType === "MARKET" ? price.toFixed(2) : (parseFloat(limitPrice) || 0).toFixed(2)}
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
          {isPlacing ? "Placing…" : `${side === "BUY" ? "Buy" : "Sell"} ${ticker}`}
        </button>
      </form>
    </div>
  );
}
