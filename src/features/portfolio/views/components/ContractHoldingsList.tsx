import { useNavigate } from "react-router";
import { FileText } from "lucide-react";
import type { Holding } from "@/features/portfolio/types/portfolio";

type Props = {
  holdings: Holding[];
  totalCost: number;
  isLoading: boolean;
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

export function ContractHoldingsList({ holdings, totalCost, isLoading }: Props) {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-lg font-semibold sm:text-xl">Contract Holdings</h2>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground sm:px-6 sm:py-4 sm:text-sm">
                  Contract
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground sm:px-6 sm:py-4 sm:text-sm">
                  Type
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
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-4 py-4 sm:px-6">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!isLoading && holdings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="size-8 opacity-20" />
                      <span>No contract holdings yet.</span>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading &&
                holdings.map((h, i) => {
                  const allocation = totalCost > 0 ? (h.totalCost / totalCost) * 100 : 0;
                  return (
                    <tr
                      key={`${h.ticker}-${i}`}
                      onClick={() => navigate(`/options/${h.ticker}`)}
                      className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-accent"
                    >
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                            <FileText className="size-4 text-violet-400" />
                          </div>
                          <span className="font-medium text-foreground">{h.ticker}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {h.instrumentType}
                        </span>
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
                        <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-xs text-violet-400">
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
