import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/shared/components/FadeIn";
import type { WalletTransaction } from "@/features/wallet/types/wallet";

type Props = {
  transactions: WalletTransaction[];
  currency?: string;
};

function fmt(value: number, currency = "USD") {
  return value.toLocaleString("en-US", { style: "currency", currency });
}

export function WalletFlowCard({ transactions, currency = "USD" }: Props) {
  const totalDeposited = transactions
    .filter((tx) => tx.type === "DEPOSIT")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdrawn = transactions
    .filter((tx) => tx.type === "WITHDRAWAL")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <FadeIn delay={200}>
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-5 text-base font-semibold">Transaction Summary</h3>

        <div className="grid grid-cols-2 divide-x divide-border">
          {/* Deposited */}
          <div className="pr-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-success/10">
                <ArrowDownLeft className="size-4 text-success" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Deposited</span>
            </div>
            <p className="text-xl font-bold tabular-nums text-success sm:text-2xl">
              {fmt(totalDeposited, currency)}
            </p>
          </div>

          {/* Withdrawn */}
          <div className="pl-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-destructive/10">
                <ArrowUpRight className="size-4 text-destructive" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Withdrawn</span>
            </div>
            <p className="text-xl font-bold tabular-nums text-destructive sm:text-2xl">
              {fmt(totalWithdrawn, currency)}
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
