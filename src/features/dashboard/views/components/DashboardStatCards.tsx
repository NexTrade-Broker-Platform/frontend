import { Link } from "react-router";
import { Activity, DollarSign } from "lucide-react";

type DashboardStatCardsProps = {
  availableBalance: number;
  holdingsCount: number;
  isLoading: boolean;
};

export function DashboardStatCards({
  availableBalance,
  holdingsCount,
  isLoading,
}: DashboardStatCardsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div
        className="animate-hero-in rounded-xl border border-border bg-card p-5 sm:p-6"
        style={{ animationDelay: "100ms" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Cash Balance</span>
          <div className="rounded-lg bg-success/10 p-2">
            <DollarSign className="size-4 text-success" />
          </div>
        </div>
        {isLoading ? (
          <div className="mb-2 h-7 w-32 animate-pulse rounded bg-muted" />
        ) : (
          <p className="mb-2 text-2xl font-semibold tabular-nums">
            ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        )}
        <Link to="/wallet" className="text-xs text-primary hover:underline">
          Manage Wallet
        </Link>
      </div>

      <div
        className="animate-hero-in rounded-xl border border-border bg-card p-5 sm:p-6"
        style={{ animationDelay: "175ms" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Active Positions</span>
          <div className="rounded-lg bg-chart-2/10 p-2">
            <Activity className="size-4 text-chart-2" />
          </div>
        </div>
        {isLoading ? (
          <div className="mb-2 h-7 w-16 animate-pulse rounded bg-muted" />
        ) : (
          <p className="mb-2 text-2xl font-semibold tabular-nums">{holdingsCount}</p>
        )}
        <Link to="/portfolio" className="text-xs text-primary hover:underline">
          View Portfolio
        </Link>
      </div>
    </div>
  );
}
