import { useState } from "react";
import { Link } from "react-router";
import { AlertCircle, ArrowDownRight, ArrowUpRight, Loader2, Search } from "lucide-react";
import { useMarkets } from "@/features/markets/hooks/useMarkets";

export function MarketsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: stocks, isLoading, isError, error } = useMarkets({ limit: 50 });

  const filtered = (stocks ?? []).filter(
    (s) =>
      s.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sector.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="mb-2">Markets</h1>
        <p className="text-muted-foreground">Browse and trade available instruments</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ticker, name or sector…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-input bg-input-background py-3 pl-10 pr-4 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {isError && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="size-5 shrink-0" />
          <span>{(error as Error).message}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground">Ticker</th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground">Sector</th>
                <th className="px-6 py-4 text-right text-sm text-muted-foreground">Price</th>
                <th className="px-6 py-4 text-right text-sm text-muted-foreground">Change</th>
                <th className="px-6 py-4 text-right text-sm text-muted-foreground">Volume</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))}
              {!isLoading &&
                filtered.map((stock) => (
                  <tr
                    key={stock.ticker}
                    className="border-b border-border transition-colors last:border-0 hover:bg-accent"
                  >
                    <td className="px-6 py-4">
                      <Link to={`/stock/${stock.ticker}`} className="font-medium text-primary hover:underline">
                        {stock.ticker}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-foreground">{stock.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                        {stock.sector}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-foreground">
                      ${stock.currentPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className={`flex items-center justify-end gap-1 ${
                          stock.change >= 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        {stock.change >= 0 ? (
                          <ArrowUpRight className="size-4" />
                        ) : (
                          <ArrowDownRight className="size-4" />
                        )}
                        <span>
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change.toFixed(2)} ({stock.changePercent >= 0 ? "+" : ""}
                          {stock.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      {stock.volume.toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="mt-8 flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="size-6 opacity-40" />
          <span>No instruments found matching your search</span>
        </div>
      )}
    </div>
  );
}
