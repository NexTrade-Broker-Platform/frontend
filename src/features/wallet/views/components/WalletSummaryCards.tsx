import { ArrowDownRight, ArrowUpRight, DollarSign } from "lucide-react";
import type { WalletTransaction } from "@/features/wallet/types/wallet";

type WalletSummaryCardsProps = {
  availableBalance?: number;
  reservedBalance?: number;
  currency?: string;
  transactions: WalletTransaction[];
  isLoading?: boolean;
};

function formatMoney(value: number, currency = "USD") {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency,
  });
}

export function WalletSummaryCards({
  availableBalance,
  reservedBalance,
  currency = "USD",
  transactions,
  isLoading = false,
}: WalletSummaryCardsProps) {
  const totalDeposited = transactions
    .filter((tx) => tx.type === "DEPOSIT")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdrawn = transactions
    .filter((tx) => tx.type === "WITHDRAWAL")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="mb-8 grid gap-6 md:grid-cols-3">
      <div className="rounded-xl border border-border bg-gradient-to-br from-wallet-balance-gradient-from to-wallet-balance-gradient-to p-6 text-primary-foreground">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm opacity-90 text-foreground">
            Available Balance
          </span>
          <DollarSign className="size-5 opacity-90 text-foreground" />
        </div>

        <div className="mb-1 text-3xl text-foreground">
          {isLoading || availableBalance === undefined
            ? "—"
            : formatMoney(availableBalance, currency)}
        </div>

        <div className="text-sm opacity-75 text-foreground">
          Reserved:{" "}
          {reservedBalance === undefined
            ? "—"
            : formatMoney(reservedBalance, currency)}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 text-card-foreground">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Deposited</span>
          <div className="rounded-lg bg-surface-positive p-2">
            <ArrowDownRight className="size-4 text-success" />
          </div>
        </div>

        <div className="mb-1">{formatMoney(totalDeposited, currency)}</div>
        <div className="text-sm text-muted-foreground">
          From loaded transactions
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 text-card-foreground">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Withdrawn</span>
          <div className="rounded-lg bg-muted p-2">
            <ArrowUpRight className="size-4 text-muted-foreground" />
          </div>
        </div>

        <div className="mb-1">{formatMoney(totalWithdrawn, currency)}</div>
        <div className="text-sm text-muted-foreground">
          From loaded transactions
        </div>
      </div>
    </div>
  );
}
