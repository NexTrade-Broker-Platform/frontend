import { useEffect, useRef } from "react";
import { ArrowDownLeft, ArrowUpRight, Loader2, Receipt } from "lucide-react";
import type { useInfiniteWalletTransactions } from "@/features/wallet/hooks/useInfiniteWalletTransactions";
import type { WalletTransaction } from "@/features/wallet/types/wallet";
import { FadeIn } from "@/shared/components/FadeIn";

type Props = {
  query: ReturnType<typeof useInfiniteWalletTransactions>;
};

const TYPE_STYLES: Record<WalletTransaction["type"], { icon: React.ElementType; iconBg: string; iconColor: string }> = {
  DEPOSIT:       { icon: ArrowDownLeft, iconBg: "bg-success/10",     iconColor: "text-success" },
  WITHDRAWAL:    { icon: ArrowUpRight,  iconBg: "bg-destructive/10", iconColor: "text-destructive" },
  ORDER_HOLD:    { icon: ArrowUpRight,  iconBg: "bg-primary/10",     iconColor: "text-primary" },
  ORDER_RELEASE: { icon: ArrowDownLeft, iconBg: "bg-chart-2/10",     iconColor: "text-chart-2" },
};

const TYPE_LABELS: Record<WalletTransaction["type"], string> = {
  DEPOSIT:       "Deposit",
  WITHDRAWAL:    "Withdrawal",
  ORDER_HOLD:    "Order Hold",
  ORDER_RELEASE: "Order Release",
};

function signedAmount(tx: WalletTransaction) {
  return tx.type === "WITHDRAWAL" || tx.type === "ORDER_HOLD"
    ? -Math.abs(tx.amount)
    : Math.abs(tx.amount);
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function WalletTransactionHistory({ query }: Props) {
  const { data, isLoading, isError, error, isFetchingNextPage, hasNextPage, fetchNextPage } = query;

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const transactions = data?.pages.flatMap((p) => p.transactions) ?? [];

  return (
    <FadeIn delay={250}>
      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-base font-semibold">Transaction History</h3>
        </div>

        {/* Initial loading */}
        {isLoading && (
          <div className="space-y-0 divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="size-9 animate-pulse rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <div className="px-5 py-6 text-sm text-destructive">
            {(error as Error).message}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && transactions.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <Receipt className="size-10 opacity-20" />
            <p className="text-sm">No transactions yet.</p>
          </div>
        )}

        {/* Transaction rows */}
        {transactions.length > 0 && (
          <ul className="divide-y divide-border">
            {transactions.map((tx) => {
              const amt = signedAmount(tx);
              const isPositive = amt > 0;
              const style = TYPE_STYLES[tx.type] ?? TYPE_STYLES.DEPOSIT;
              const Icon = style.icon;

              return (
                <li key={tx.id} className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent/40 sm:px-5">
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${style.iconBg}`}>
                    <Icon className={`size-4 ${style.iconColor}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{TYPE_LABELS[tx.type]}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(tx.createdAt)}
                      <span className="mx-1 opacity-40">·</span>
                      {formatTime(tx.createdAt)}
                    </p>
                  </div>

                  <span className={`shrink-0 tabular-nums text-sm font-semibold ${isPositive ? "text-success" : "text-foreground"}`}>
                    {isPositive ? "+" : "-"}${Math.abs(amt).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {/* Sentinel + loading more */}
        <div ref={sentinelRef} className="px-5 py-4 text-center">
          {isFetchingNextPage && (
            <Loader2 className="mx-auto size-4 animate-spin text-muted-foreground" />
          )}
          {!hasNextPage && transactions.length > 0 && (
            <p className="text-xs text-muted-foreground">All transactions loaded</p>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
