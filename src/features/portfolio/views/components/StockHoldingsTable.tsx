import { useNavigate } from "react-router";
import type { Holding } from "@/features/portfolio/types/portfolio";

type Props = {
  holdings: Holding[];
  totalCost: number;
  isLoading: boolean;
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

export function StockHoldingsTable({ holdings, totalCost, isLoading }: Props) {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-lg font-semibold sm:text-xl">Stock Holdings</h2>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground sm:px-6 sm:py-4 sm:text-sm">
                  Ticker
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground sm:px-6 sm:py-4 sm:text-sm">
                  Qty
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground sm:px-6 sm:py-4 sm:text-sm">
                  Avg Cost
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground sm:px-6 sm:py-4 sm:text-sm">
                  Total Cost
                </th>
                <th className="hidden px-4 py-3 text-right text-xs font-medium text-muted-foreground sm:table-cell sm:px-6 sm:py-4 sm:text-sm">
                  Allocation
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-4 py-4 sm:px-6">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!isLoading && holdings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    No stock holdings yet.
                  </td>
                </tr>
              )}

              {!isLoading &&
                holdings.map((h) => {
                  const allocation = totalCost > 0 ? (h.totalCost / totalCost) * 100 : 0;
                  return (
                    <tr
                      key={h.ticker}
                      onClick={() => navigate(`/stock/${h.ticker}`)}
                      className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-accent"
                    >
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary sm:size-9">
                            {h.ticker.slice(0, 2)}
                          </div>
                          <span className="font-medium text-primary">{h.ticker}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums text-foreground sm:px-6">
                        {h.quantity}
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums text-foreground sm:px-6">
                        ${fmt(h.averageCost)}
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums font-medium text-foreground sm:px-6">
                        ${fmt(h.totalCost)}
                      </td>
                      <td className="hidden px-4 py-4 text-right sm:table-cell sm:px-6">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          {allocation.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
