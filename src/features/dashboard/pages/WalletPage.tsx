import { useState, type FormEvent } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "buy" | "sell";
  amount: number;
  date: string;
  description: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "deposit",
    amount: 5000,
    date: "2026-04-18",
    description: "Bank Transfer",
  },
  {
    id: "2",
    type: "buy",
    amount: -9125,
    date: "2026-04-17",
    description: "Bought 50 AAPL @ $182.50",
  },
  {
    id: "3",
    type: "deposit",
    amount: 10000,
    date: "2026-04-15",
    description: "Wire Transfer",
  },
  {
    id: "4",
    type: "buy",
    amount: -11370,
    date: "2026-04-14",
    description: "Bought 30 MSFT @ $379.00",
  },
  {
    id: "5",
    type: "sell",
    amount: 2450,
    date: "2026-04-12",
    description: "Sold 10 TSLA @ $245.00",
  },
  {
    id: "6",
    type: "deposit",
    amount: 7500,
    date: "2026-04-10",
    description: "Bank Transfer",
  },
];

export function WalletPage() {
  const [action, setAction] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank");

  const availableBalance = 12450.0;
  const totalDeposited = 22500.0;
  const totalWithdrawn = 0.0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (value <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (action === "withdraw" && value > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    toast.success(
      `${action === "deposit" ? "Deposit" : "Withdrawal"} of $${value.toFixed(2)} initiated successfully`,
    );
    setAmount("");
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="mb-2">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your funds and view transaction history
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-gradient-to-br from-primary to-chart-2 p-6 text-white">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm opacity-90">Available Balance</span>
            <DollarSign className="size-5 opacity-90" />
          </div>
          <div className="mb-1 text-3xl">
            $
            {availableBalance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className="text-sm opacity-75">Ready to trade</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Total Deposited
            </span>
            <div className="rounded-lg bg-success/10 p-2">
              <ArrowDownRight className="size-4 text-success" />
            </div>
          </div>
          <div className="mb-1">
            $
            {totalDeposited.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className="text-sm text-muted-foreground">All time</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Total Withdrawn
            </span>
            <div className="rounded-lg bg-muted/50 p-2">
              <ArrowUpRight className="size-4 text-muted-foreground" />
            </div>
          </div>
          <div className="mb-1">
            $
            {totalWithdrawn.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className="text-sm text-muted-foreground">All time</div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-6">Add/Withdraw Funds</h3>

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
                <label
                  htmlFor="amount"
                  className="mb-2 block text-sm text-foreground"
                >
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
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
                <label className="mb-2 block text-sm text-foreground">
                  Payment Method
                </label>
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
                      <div className="text-sm text-foreground">
                        Bank Transfer
                      </div>
                      <div className="text-xs text-muted-foreground">
                        2-3 business days
                      </div>
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
                        <div className="text-sm text-foreground">
                          Debit Card
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Instant
                        </div>
                      </div>
                      <CreditCard className="size-5 text-muted-foreground" />
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full rounded-lg px-4 py-3 text-white transition-opacity hover:opacity-90 ${
                  action === "deposit" ? "bg-success" : "bg-destructive"
                }`}
              >
                {action === "deposit" ? "Deposit" : "Withdraw"} Funds
              </button>
            </form>

            <div className="mt-4 text-xs text-muted-foreground">
              Transactions are simulated for demo purposes
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-6">Transaction History</h3>
            <div className="space-y-3">
              {mockTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg ${
                        transaction.type === "deposit"
                          ? "bg-success/10"
                          : transaction.type === "withdrawal"
                            ? "bg-destructive/10"
                            : transaction.type === "buy"
                              ? "bg-primary/10"
                              : "bg-chart-2/10"
                      }`}
                    >
                      {transaction.type === "deposit" ||
                      transaction.type === "buy" ? (
                        <ArrowDownRight
                          className={`size-5 ${
                            transaction.type === "deposit"
                              ? "text-success"
                              : "text-primary"
                          }`}
                        />
                      ) : (
                        <ArrowUpRight
                          className={`size-5 ${
                            transaction.type === "withdrawal"
                              ? "text-destructive"
                              : "text-chart-2"
                          }`}
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-foreground">
                        {transaction.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${transaction.amount > 0 ? "text-success" : "text-foreground"}`}
                  >
                    {transaction.amount > 0 ? "+" : ""}$
                    {Math.abs(transaction.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
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
