import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { mockStocks } from "../model/mockData";
const priceHistory = [
  { time: "9:30", price: 180.45 },
  { time: "10:00", price: 181.2 },
  { time: "10:30", price: 180.9 },
  { time: "11:00", price: 181.8 },
  { time: "11:30", price: 182.1 },
  { time: "12:00", price: 181.5 },
  { time: "12:30", price: 182.45 },
];

export function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const stock = mockStocks.find((s) => s.symbol === symbol);

  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("");
  const [limitPrice, setLimitPrice] = useState("");

  if (!stock) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <h2 className="mb-2">Stock not found</h2>
          <Link to="/markets" className="text-primary hover:underline">
            Back to Markets
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = (e: FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity, 10);
    if (qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    if (orderType === "limit" && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      toast.error("Please enter a valid limit price");
      return;
    }

    const price = orderType === "market" ? stock.price : parseFloat(limitPrice);
    const total = qty * price;

    toast.success(
      `${action === "buy" ? "Buy" : "Sell"} order placed: ${qty} shares of ${stock.symbol} at $${price.toFixed(2)} (Total: $${total.toFixed(2)})`,
    );

    setQuantity("");
    setLimitPrice("");
  };

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
              <h1>{stock.symbol}</h1>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs ${
                  stock.type === "stock"
                    ? "bg-primary/10 text-primary"
                    : "bg-chart-2/10 text-chart-2"
                }`}
              >
                {stock.type}
              </span>
            </div>
            <p className="text-muted-foreground">{stock.name}</p>
          </div>

          <div className="mb-6 flex items-end gap-4">
            <div>
              <div className="mb-1 text-4xl">${stock.price.toFixed(2)}</div>
              <div
                className={`flex items-center gap-1 ${
                  stock.change >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {stock.change >= 0 ? (
                  <ArrowUpRight className="size-5" />
                ) : (
                  <ArrowDownRight className="size-5" />
                )}
                <span>
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)} (
                  {stock.changePercent >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-1 text-sm text-muted-foreground">Volume</div>
              <div className="text-foreground">{stock.volume}</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-1 text-sm text-muted-foreground">
                Market Cap
              </div>
              <div className="text-foreground">{stock.marketCap}</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-1 text-sm text-muted-foreground">24h High</div>
              <div className="text-success">${stock.high24h?.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-1 text-sm text-muted-foreground">24h Low</div>
              <div className="text-destructive">
                ${stock.low24h?.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-6">Price Chart (Today)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="time" stroke="var(--muted-foreground)" />
                <YAxis
                  domain={["dataMin - 1", "dataMax + 1"]}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={stock.change >= 0 ? "#10b981" : "#ef4444"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div className="sticky top-8 rounded-xl border border-border bg-card p-6">
            <h3 className="mb-6">Place Order</h3>

            <div className="mb-6 inline-flex w-full rounded-lg border border-border bg-muted/50 p-1">
              <button
                onClick={() => setAction("buy")}
                className={`flex-1 rounded-md px-4 py-2 transition-colors ${
                  action === "buy"
                    ? "bg-success text-success-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setAction("sell")}
                className={`flex-1 rounded-md px-4 py-2 transition-colors ${
                  action === "sell"
                    ? "bg-destructive text-destructive-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sell
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-foreground">
                  Order Type
                </label>
                <div className="inline-flex w-full rounded-lg border border-border bg-muted/50 p-1">
                  <button
                    type="button"
                    onClick={() => setOrderType("market")}
                    className={`flex-1 rounded-md px-4 py-2 text-sm transition-colors ${
                      orderType === "market"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Market
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType("limit")}
                    className={`flex-1 rounded-md px-4 py-2 text-sm transition-colors ${
                      orderType === "limit"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Limit
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="mb-2 block text-sm text-foreground"
                >
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

              {orderType === "limit" && (
                <div>
                  <label
                    htmlFor="limitPrice"
                    className="mb-2 block text-sm text-foreground"
                  >
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
                    <span className="text-muted-foreground">
                      Estimated Total
                    </span>
                    <span className="text-foreground">
                      $
                      {(
                        (parseInt(quantity, 10) || 0) *
                        (orderType === "market"
                          ? stock.price
                          : parseFloat(limitPrice) || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Price per share
                    </span>
                    <span className="text-foreground">
                      $
                      {orderType === "market"
                        ? stock.price.toFixed(2)
                        : (parseFloat(limitPrice) || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`w-full rounded-lg px-4 py-3 text-white transition-opacity hover:opacity-90 ${
                  action === "buy" ? "bg-success" : "bg-destructive"
                }`}
              >
                {action === "buy" ? (
                  <TrendingUp className="mr-2 inline size-4" />
                ) : (
                  <TrendingDown className="mr-2 inline size-4" />
                )}
                {action === "buy" ? "Buy" : "Sell"} {stock.symbol}
              </button>
            </form>

            <div className="mt-4 text-xs text-muted-foreground">
              Orders are simulated for demo purposes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
