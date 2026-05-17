import { useNavigate } from "react-router";
import type { Holding } from "@/features/portfolio/types/portfolio";
import { useNotifications } from "@/providers/NotificationProvider";

type Props = {
  holdings: Holding[];
  totalCost: number;
  isLoading: boolean;
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

function fmtPnl(n: number) {
  return `${n >= 0 ? "+" : "-"}$${fmt(Math.abs(n))}`;
}

export function StockHoldingsTable({ holdings, totalCost, isLoading }: Props) {
  const navigate = useNavigate();
  const { priceUpdates } = useNotifications();

  const hasSomeLive = holdings.some((h) => priceUpdates[h.ticker]);

  let totalMarketValue = 0;
  let allLive = holdings.length > 0;
  for (const h of holdings) {
    const live = priceUpdates[h.ticker];
    if (live) totalMarketValue += live.price * h.quantity;
    else allLive = false;
  }

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
                  Book Value
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground sm:px-6 sm:py-4 sm:text-sm">
                  Live Price
                </th>
                <th className="hidden px-4 py-3 text-right text-xs font-medium text-muted-foreground sm:table-cell sm:px-6 sm:py-4 sm:text-sm">
                  Market Value
                </th>
                <th className="hidden px-4 py-3 text-right text-xs font-medium text-muted-foreground sm:table-cell sm:px-6 sm:py-4 sm:text-sm">
                  Alloc
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-4 sm:px-6">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!isLoading && holdings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    No stock holdings yet.
                  </td>
                </tr>
              )}

              {!isLoading &&
                holdings.map((h) => {
                  const allocation = totalCost > 0 ? (h.totalCost / totalCost) * 100 : 0;
                  const live = priceUpdates[h.ticker];
                  const marketValue = live ? live.price * h.quantity : null;
                  const pnl = marketValue !== null ? marketValue - h.totalCost : null;

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

                      {/* Live Price */}
                      <td className="px-4 py-4 text-right sm:px-6">
                        {live ? (
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="tabular-nums font-medium text-foreground">
                              ${fmt(live.price)}
                            </span>
                            <span
                              className={`text-xs tabular-nums ${
                                live.change_pct >= 0 ? "text-success" : "text-destructive"
                              }`}
                            >
                              {live.change_pct >= 0 ? "+" : ""}
                              {live.change_pct.toFixed(2)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>

                      {/* Market Value + P&L */}
                      <td className="hidden px-4 py-4 text-right sm:table-cell sm:px-6">
                        {marketValue !== null ? (
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="tabular-nums font-medium text-foreground">
                              ${fmt(marketValue)}
                            </span>
                            {pnl !== null && (
                              <span
                                className={`text-xs tabular-nums ${
                                  pnl >= 0 ? "text-success" : "text-destructive"
                                }`}
                              >
                                {fmtPnl(pnl)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
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

            {/* Totals footer — only when at least one live price is available */}
            {!isLoading && holdings.length > 0 && hasSomeLive && (
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/30">
                  <td
                    colSpan={3}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:px-6"
                  >
                    Total
                    {!allLive && (
                      <span className="ml-1 font-normal normal-case tracking-normal opacity-60">
                        (partial)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-sm font-semibold text-foreground sm:px-6">
                    ${fmt(totalCost)}
                  </td>
                  {/* empty live-price cell */}
                  <td className="px-4 py-3 sm:px-6" />
                  {/* total market value + total P&L */}
                  <td className="hidden px-4 py-3 text-right sm:table-cell sm:px-6">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="tabular-nums text-sm font-semibold text-foreground">
                        ${fmt(totalMarketValue)}
                      </span>
                      {(() => {
                        const totalPnl = totalMarketValue - totalCost;
                        return (
                          <span
                            className={`text-xs tabular-nums ${
                              totalPnl >= 0 ? "text-success" : "text-destructive"
                            }`}
                          >
                            {fmtPnl(totalPnl)}
                          </span>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell" />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
