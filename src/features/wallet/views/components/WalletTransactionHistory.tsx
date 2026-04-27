import { ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";
import type { WalletTransaction } from "@/features/wallet/types/wallet";

type WalletTransactionHistoryProps = {
  transactions: WalletTransaction[];
  isLoading?: boolean;
  errorMessage?: string;
};

function getTransactionDescription(type: WalletTransaction["type"]) {
  switch (type) {
    case "DEPOSIT":
      return "Deposit";
    case "WITHDRAWAL":
      return "Withdrawal";
    case "ORDER_HOLD":
      return "Order hold";
    case "ORDER_RELEASE":
      return "Order release";
    default:
      return "Wallet transaction";
  }
}

function getSignedAmount(transaction: WalletTransaction) {
  if (transaction.type === "WITHDRAWAL" || transaction.type === "ORDER_HOLD") {
    return -Math.abs(transaction.amount);
  }

  return Math.abs(transaction.amount);
}

function getTransactionIconStyles(type: WalletTransaction["type"]) {
  switch (type) {
    case "DEPOSIT":
      return {
        containerClassName: "bg-surface-positive",
        iconClassName: "text-success",
      };
    case "WITHDRAWAL":
      return {
        containerClassName: "bg-surface-negative",
        iconClassName: "text-destructive",
      };
    case "ORDER_HOLD":
      return {
        containerClassName: "bg-surface-info",
        iconClassName: "text-primary",
      };
    case "ORDER_RELEASE":
      return {
        containerClassName: "bg-surface-accent",
        iconClassName: "text-chart-2",
      };
    default:
      return {
        containerClassName: "bg-muted",
        iconClassName: "text-muted-foreground",
      };
  }
}

function formatDate(value: string) {
  if (!value) return "Unknown date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function WalletTransactionHistory({
  transactions,
  isLoading = false,
  errorMessage,
}: WalletTransactionHistoryProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-card-foreground">
      <h3 className="mb-6">Transaction History</h3>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading transactions...
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="rounded-lg border border-destructive bg-surface-negative p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && transactions.length === 0 && (
        <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
          No transactions yet.
        </div>
      )}

      {!isLoading && !errorMessage && transactions.length > 0 && (
        <div className="space-y-3">
          {transactions.map((tx) => {
            const signedAmount = getSignedAmount(tx);
            const isPositive = signedAmount > 0;
            const iconStyles = getTransactionIconStyles(tx.type);

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex size-10 items-center justify-center rounded-lg ${iconStyles.containerClassName}`}
                  >
                    {isPositive ? (
                      <ArrowDownRight
                        className={`size-5 ${iconStyles.iconClassName}`}
                      />
                    ) : (
                      <ArrowUpRight
                        className={`size-5 ${iconStyles.iconClassName}`}
                      />
                    )}
                  </div>

                  <div>
                    <div className="text-sm text-foreground">
                      {getTransactionDescription(tx.type)}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {formatDate(tx.createdAt)}
                    </div>
                  </div>
                </div>

                <div
                  className={isPositive ? "text-success" : "text-foreground"}
                >
                  {isPositive ? "+" : "-"}$
                  {Math.abs(signedAmount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
