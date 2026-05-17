import { DollarSign } from "lucide-react";
import { FadeIn } from "@/shared/components/FadeIn";

type Props = {
  availableBalance?: number;
  reservedBalance?: number;
  currency?: string;
  isLoading?: boolean;
};

function fmt(value: number, currency = "USD") {
  return value.toLocaleString("en-US", { style: "currency", currency });
}

export function WalletSummaryCards({
  availableBalance,
  reservedBalance,
  currency = "USD",
  isLoading = false,
}: Props) {
  return (
    <FadeIn delay={75}>
      <div className="mb-6 rounded-2xl border border-border bg-linear-to-br from-wallet-balance-gradient-from to-wallet-balance-gradient-to p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground/80">Available Balance</span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-white/10">
            <DollarSign className="size-4 text-foreground" />
          </div>
        </div>

        {isLoading || availableBalance === undefined ? (
          <div className="mb-2 h-9 w-48 animate-pulse rounded-lg bg-white/20" />
        ) : (
          <p className="mb-2 text-3xl font-bold tabular-nums text-foreground sm:text-4xl">
            {fmt(availableBalance, currency)}
          </p>
        )}

        <p className="text-sm text-foreground/70">
          Reserved:{" "}
          {reservedBalance === undefined ? "—" : fmt(reservedBalance, currency)}
        </p>
      </div>
    </FadeIn>
  );
}
