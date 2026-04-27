import { useState, type FormEvent } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDeposit } from "@/features/wallet/hooks/useDeposit";
import { useWithdraw } from "@/features/wallet/hooks/useWithdraw";

export function WalletActionForm() {
  const [action, setAction] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank");

  const depositMutation = useDeposit();
  const withdrawMutation = useWithdraw();

  const isPending = depositMutation.isPending || withdrawMutation.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const value = Number(amount);

    if (!value || value <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const payload = {
      amount: value,
      currency: "USD",
    };

    if (action === "deposit") {
      depositMutation.mutate(payload, {
        onSuccess: (result) => {
          toast.success(result.message);
          setAmount("");
        },
        onError: (err) => {
          toast.error(err.message);
        },
      });

      return;
    }

    withdrawMutation.mutate(payload, {
      onSuccess: (result) => {
        toast.success(result.message);
        setAmount("");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 text-card-foreground">
      <h3 className="mb-6">Add / Withdraw Funds</h3>

      <div className="mb-6 inline-flex w-full rounded-lg border border-border bg-muted p-1">
        <button
          type="button"
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
          type="button"
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
            Amount (USD)
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
              className="w-full rounded-lg border border-input bg-input-background py-3 pl-8 pr-4 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
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
                className="size-4 accent-primary"
              />

              <div className="flex-1">
                <div className="text-sm text-foreground">Bank Transfer</div>
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
                className="size-4 accent-primary"
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
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${
            action === "deposit"
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {action === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
        </button>
      </form>
    </div>
  );
}
