import { FileText, Info } from "lucide-react";
import type { Holding } from "@/features/portfolio/types/portfolio";
import type { Option } from "@/features/markets/types/markets";

type Props = {
  holding: Holding;
  option: Option;
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function OptionContractPosition({ holding, option }: Props) {
  const currentValue = holding.quantity * option.premium;
  const costBasis = holding.totalCost;
  const unrealizedPnl = currentValue - costBasis;
  const unrealizedPnlPct = costBasis > 0 ? (unrealizedPnl / costBasis) * 100 : 0;
  const isProfit = unrealizedPnl >= 0;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/10">
          <FileText className="size-4 text-violet-400" />
        </div>
        <h3 className="text-base font-semibold text-foreground">Your Position</h3>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="mb-0.5 text-xs text-muted-foreground">Contracts Owned</p>
          <p className="text-lg font-bold text-foreground">{holding.quantity}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="mb-0.5 text-xs text-muted-foreground">Avg Cost</p>
          <p className="text-lg font-bold text-foreground">${fmt(holding.averageCost)}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="mb-0.5 text-xs text-muted-foreground">Current Value</p>
          <p className="text-lg font-bold text-foreground">${fmt(currentValue)}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="mb-0.5 text-xs text-muted-foreground">Unrealized P&L</p>
          <p className={`text-lg font-bold ${isProfit ? "text-success" : "text-destructive"}`}>
            {isProfit ? "+" : ""}${fmt(unrealizedPnl)}
            <span className="ml-1 text-xs font-normal">
              ({isProfit ? "+" : ""}{unrealizedPnlPct.toFixed(2)}%)
            </span>
          </p>
        </div>
      </div>

      {option.isActive && (
        <div className="flex items-start gap-2 rounded-lg bg-primary/5 px-3 py-2.5 text-xs text-primary">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          <span>
            This contract will auto-exercise at expiry if it's in the money — no action required.
            You can sell your position early using the trade panel.
          </span>
        </div>
      )}
    </div>
  );
}
