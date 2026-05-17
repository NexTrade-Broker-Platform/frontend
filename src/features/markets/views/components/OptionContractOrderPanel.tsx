import { useState } from "react";
import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { usePlaceOrder } from "@/features/orders/hooks/usePlaceOrder";
import type { OrderSide, OrderType } from "@/features/orders/types/orders";

type Props = {
  optionId: string;
  premium: number;
  isActive: boolean;
  userQuantity?: number;
};

export function OptionContractOrderPanel({ optionId, premium, isActive, userQuantity = 0 }: Props) {
  const { mutate: placeOrder, isPending } = usePlaceOrder();

  const [side, setSide] = useState<OrderSide>("BUY");
  const [orderType, setOrderType] = useState<OrderType>("MARKET");
  const [quantity, setQuantity] = useState("");
  const [limitPrice, setLimitPrice] = useState("");

  const qty = parseInt(quantity, 10) || 0;
  const effectivePrice = orderType === "MARKET" ? premium : parseFloat(limitPrice) || 0;
  const estimatedTotal = qty * effectivePrice;

  const canSell = side === "SELL" && userQuantity > 0;
  const isSellDisabled = side === "SELL" && userQuantity === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qty || qty <= 0) { toast.error("Please enter a valid quantity"); return; }
    if (side === "SELL" && qty > userQuantity) {
      toast.error(`You only own ${userQuantity} contract${userQuantity !== 1 ? "s" : ""}`);
      return;
    }
    if (orderType === "LIMIT" && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      toast.error("Please enter a valid limit price");
      return;
    }
    placeOrder(
      {
        instrumentType: "OPTION",
        instrumentId: optionId,
        orderType,
        side,
        quantity: qty,
        limitPrice: orderType === "LIMIT" ? parseFloat(limitPrice) : undefined,
      },
      {
        onSuccess: (order) => {
          toast.success(
            `${side === "BUY" ? "Buy" : "Sell"} order placed for ${qty} contract${qty !== 1 ? "s" : ""} (${order.status})`
          );
          setQuantity("");
          setLimitPrice("");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  if (!isActive) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          This contract has expired and can no longer be traded.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-5 text-base font-semibold text-foreground">Trade Contract</h3>

      {/* Buy / Sell toggle */}
      <div className="mb-4 inline-flex w-full rounded-lg border border-border bg-muted/50 p-1">
        <button
          type="button"
          onClick={() => setSide("BUY")}
          className={`flex-1 rounded-md px-4 py-2 text-sm transition-colors ${
            side === "BUY"
              ? "bg-success text-success-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setSide("SELL")}
          disabled={userQuantity === 0}
          className={`flex-1 rounded-md px-4 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            side === "SELL"
              ? "bg-destructive text-destructive-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sell {userQuantity > 0 && `(${userQuantity})`}
        </button>
      </div>

      {isSellDisabled && (
        <p className="mb-4 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          You don't own any contracts to sell.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order type */}
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

        {/* Quantity */}
        <div>
          <label htmlFor="oc-qty" className="mb-2 block text-sm text-foreground">
            Contracts
          </label>
          <input
            id="oc-qty"
            type="number"
            min="1"
            max={side === "SELL" ? userQuantity : undefined}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full rounded-lg border border-input bg-input-background px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Number of contracts"
            required
          />
        </div>

        {/* Limit price */}
        {orderType === "LIMIT" && (
          <div>
            <label htmlFor="oc-limit" className="mb-2 block text-sm text-foreground">
              Limit Price (per contract)
            </label>
            <input
              id="oc-limit"
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
        {qty > 0 && (
          <div className="rounded-lg bg-muted/50 p-4 text-sm">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-muted-foreground">Premium per contract</span>
              <span className="text-foreground">
                ${orderType === "MARKET" ? premium.toFixed(2) : (parseFloat(limitPrice) || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span className="text-muted-foreground">Estimated Total</span>
              <span className="text-foreground">${estimatedTotal.toFixed(2)}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || (!canSell && side === "SELL")}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${
            side === "BUY" ? "bg-success" : "bg-destructive"
          }`}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : side === "BUY" ? (
            <TrendingUp className="size-4" />
          ) : (
            <TrendingDown className="size-4" />
          )}
          {isPending ? "Placing…" : `${side === "BUY" ? "Buy" : "Sell"} Contract`}
        </button>
      </form>
    </div>
  );
}
