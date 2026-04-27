import { WalletActionForm } from "@/features/wallet/views/components/WalletActionForm";
import { WalletSummaryCards } from "@/features/wallet/views/components/WalletSummaryCards";
import { WalletTransactionHistory } from "@/features/wallet/views/components/WalletTransactionHistory";
import { useWalletBalance } from "@/features/wallet/hooks/useWalletBalance";
import { useWalletTransactions } from "@/features/wallet/hooks/useWalletTransactions";

export function WalletPage() {
  const currency = "USD";

  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useWalletBalance(currency);

  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useWalletTransactions(0, 10);

  const transactions = transactionsData?.transactions ?? [];

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="mb-2">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your funds and view transaction history
        </p>
      </div>

      {balanceError && (
        <div className="mb-6 rounded-lg border border-destructive bg-surface-negative p-4 text-sm text-destructive">
          {balanceError.message}
        </div>
      )}

      <WalletSummaryCards
        availableBalance={balanceData?.wallet.availableBalance}
        reservedBalance={balanceData?.wallet.reservedBalance}
        currency={balanceData?.wallet.currency ?? currency}
        transactions={transactions}
        isLoading={isBalanceLoading}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <WalletActionForm />
        </div>

        <div className="lg:col-span-2">
          <WalletTransactionHistory
            transactions={transactions}
            isLoading={isTransactionsLoading}
            errorMessage={transactionsError?.message}
          />
        </div>
      </div>
    </div>
  );
}
