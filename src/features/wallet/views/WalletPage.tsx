import { useState, type FormEvent } from "react";
import { ArrowDownRight, ArrowUpRight, CreditCard, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDeposit } from "@/features/wallet/hooks/useDeposit";

interface MockTransaction {
  id: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "ORDER_HOLD" | "ORDER_RELEASE";
  amount: number;
  date: string;
  description: string;
}

const mockTransactions: MockTransaction[] = [
  { id: "1", type: "DEPOSIT", amount: 5000, date: "2026-04-18", description: "Bank Transfer" },
  { id: "2", type: "ORDER_HOLD", amount: -9125, date: "2026-04-17", description: "Bought 50 AAPL @ $182.50" },
  { id: "3", type: "DEPOSIT", amount: 10000, date: "2026-04-15", description: "Wire Transfer" },
  { id: "4", type: "ORDER_HOLD", amount: -11370, date: "2026-04-14", description: "Bought 30 MSFT @ $379.00" },
  { id: "5", type: "ORDER_RELEASE", amount: 2450, date: "2026-04-12", description: "Sold 10 TSLA @ $245.00" },
  { id: "6", type: "DEPOSIT", amount: 7500, date: "2026-04-10", description: "Bank Transfer" },
];

export function WalletPage() {
  const [action, setAction] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const { mutate: deposit, isPending } = useDeposit();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (action === "deposit") {
      deposit(
        { amount: value, currency: "USD" },
        {
          onSuccess: (result) => {
            toast.success(result.message || `Deposit of $${value.toFixed(2)} initiated`);
            setAmount("");
          },
          onError: (err) => toast.error(err.message),
        },
      );
    } else {
      toast.info("Withdrawals are not yet supported");
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="mb-2">Wallet</h1>
        <p className="text-muted-foreground">Manage your funds and view transaction history</p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-gradient-to-br from-primary to-chart-2 p-6 text-white">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm opacity-90">Available Balance</span>
            <DollarSign className="size-5 opacity-90" />
          </div>
          <div className="mb-1 text-3xl">—</div>
          <div className="text-sm opacity-75">From wallet API</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Deposited</span>
            <div className="rounded-lg bg-success/10 p-2">
              <ArrowDownRight className="size-4 text-success" />
            </div>
          </div>
          <div className="mb-1">—</div>
          <div className="text-sm text-muted-foreground">All time</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Withdrawn</span>
            <div className="rounded-lg bg-muted/50 p-2">
              <ArrowUpRight className="size-4 text-muted-foreground" />
            </div>
          </div>
          <div className="mb-1">—</div>
          <div className="text-sm text-muted-foreground">All time</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-6">Add / Withdraw Funds</h3>

            <div className="mb-6 inline-flex w-full rounded-lg border border-border bg-muted/50 p-1">
              <button
                onClick={() => setAction("deposit")}
                className={`flex-1 rounded-md px-4 py-2 transition-colors ${
                  action === "deposit"
                    ? "bg-success text-success-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setAction("withdraw")}
                className={`flex-1 rounded-md px-4 py-2 transition-colors ${
                  action === "withdraw"
                    ? "bg-destructive text-destructive-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Withdraw
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="amount" className="mb-2 block text-sm text-foreground">
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-lg border border-input bg-input-background py-3 pl-8 pr-4 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-foreground">Payment Method</label>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-input bg-input-background p-4 transition-colors hover:bg-accent">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === "bank"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="size-4 text-primary"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-foreground">Bank Transfer</div>
                      <div className="text-xs text-muted-foreground">2-3 business days</div>
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-input bg-input-background p-4 transition-colors hover:bg-accent">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="size-4 text-primary"
                    />
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <div className="text-sm text-foreground">Debit Card</div>
                        <div className="text-xs text-muted-foreground">Instant</div>
                      </div>
                      <CreditCard className="size-5 text-muted-foreground" />
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${
                  action === "deposit" ? "bg-success" : "bg-destructive"
                }`}
              >
                {isPending && <Loader2 className="size-4 animate-spin" />}
                {action === "deposit" ? "Deposit" : "Withdraw"} Funds
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-6">Transaction History</h3>
            <div className="space-y-3">
              {mockTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg ${
                        tx.type === "DEPOSIT"
                          ? "bg-success/10"
                          : tx.type === "WITHDRAWAL"
                            ? "bg-destructive/10"
                            : tx.type === "ORDER_HOLD"
                              ? "bg-primary/10"
                              : "bg-chart-2/10"
                      }`}
                    >
                      {tx.amount > 0 ? (
                        <ArrowDownRight
                          className={`size-5 ${tx.type === "DEPOSIT" ? "text-success" : "text-chart-2"}`}
                        />
                      ) : (
                        <ArrowUpRight
                          className={`size-5 ${tx.type === "WITHDRAWAL" ? "text-destructive" : "text-primary"}`}
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-foreground">{tx.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className={tx.amount > 0 ? "text-success" : "text-foreground"}>
                    {tx.amount > 0 ? "+" : ""}$
                    {Math.abs(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
