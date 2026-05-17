import { useMemo } from "react";
import { FadeIn } from "@/shared/components/FadeIn";
import { useWalletBalance } from "@/features/wallet/hooks/useWalletBalance";
import { useInfiniteWalletTransactions } from "@/features/wallet/hooks/useInfiniteWalletTransactions";
import { WalletSummaryCards } from "@/features/wallet/views/components/WalletSummaryCards";
import { WalletActionForm } from "@/features/wallet/views/components/WalletActionForm";
import { WalletFlowCard } from "@/features/wallet/views/components/WalletFlowCard";
import { WalletTransactionHistory } from "@/features/wallet/views/components/WalletTransactionHistory";

export function WalletPage() {
  const currency = "USD";

  const { data: balanceData, isLoading: isBalanceLoading, error: balanceError } = useWalletBalance(currency);
  const txQuery = useInfiniteWalletTransactions();

  const allTransactions = useMemo(
    () => txQuery.data?.pages.flatMap((p) => p.transactions) ?? [],
    [txQuery.data],
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <FadeIn>
        <div className="mb-8">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Account
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Wallet</h1>
          <p className="mt-2 text-muted-foreground">Manage your funds and view transaction history</p>

          {balanceError && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {balanceError.message}
            </div>
          )}
        </div>
      </FadeIn>

      <WalletSummaryCards
        availableBalance={balanceData?.wallet.availableBalance}
        reservedBalance={balanceData?.wallet.reservedBalance}
        currency={balanceData?.wallet.currency ?? currency}
        isLoading={isBalanceLoading}
      />

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <WalletActionForm />
        <WalletFlowCard transactions={allTransactions} currency={currency} />
      </div>

      <WalletTransactionHistory query={txQuery} />
    </div>
  );
}
