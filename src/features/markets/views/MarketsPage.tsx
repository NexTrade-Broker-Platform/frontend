import { useState } from "react";
import { Link } from "react-router";
import { AlertCircle, ArrowDownRight, ArrowUpRight, Loader2, Search } from "lucide-react";
import { useMarkets } from "@/features/markets/hooks/useMarkets";
import { useOptions } from "@/features/markets/hooks/useOptions";
import { useNotifications } from "@/providers/NotificationProvider";

type Tab = "STOCKS" | "OPTIONS";

export function MarketsPage() {
  const [tab, setTab] = useState<Tab>("STOCKS");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: stocks, isLoading: stocksLoading, isError: stocksError, error: stocksErr } = useMarkets({ limit: 50 });
  const { data: options, isLoading: optionsLoading, isError: optionsError, error: optionsErr } = useOptions();
  const { priceUpdates } = useNotifications();

  const filteredStocks = (stocks ?? []).filter(
    (s) =>
      s.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sector.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredOptions = (options ?? []).filter(
    (o) =>
      o.underlyingTicker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.optionType.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const isLoading = tab === "STOCKS" ? stocksLoading : optionsLoading;
  const isError = tab === "STOCKS" ? stocksError : optionsError;
  const error = tab === "STOCKS" ? stocksErr : optionsErr;

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2">Markets</h1>
          <p className="text-muted-foreground">Browse and trade available instruments</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs text-success">
          <span className="size-2 animate-pulse rounded-full bg-success" />
          Live
        </div>
      </div>

      {/* Tab toggle */}
      <div className="mb-6 inline-flex rounded-lg border border-border bg-muted/50 p-1">
        <button
          onClick={() => { setTab("STOCKS"); setSearchTerm(""); }}
          className={`rounded-md px-6 py-2 text-sm transition-colors ${
            tab === "STOCKS" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Stocks
        </button>
        <button
          onClick={() => { setTab("OPTIONS"); setSearchTerm(""); }}
          className={`rounded-md px-6 py-2 text-sm transition-colors ${
            tab === "OPTIONS" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Options
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={tab === "STOCKS" ? "Search by ticker, name or sector…" : "Search by ticker or type…"}
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

      {tab === "STOCKS" && (
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
                {stocksLoading &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 animate-pulse rounded bg-muted" />
                        </td>
                      ))}
                    </tr>
                  ))}
                {!stocksLoading &&
                  filteredStocks.map((stock) => {
                    const live = priceUpdates[stock.ticker];
                    const price = live?.price ?? stock.currentPrice;
                    const change = live?.change ?? stock.change;
                    const changePct = live?.change_pct ?? stock.changePercent;
                    const volume = live?.volume ?? stock.volume;

                    return (
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
                        <td className="px-6 py-4 text-right">
                          <span className="text-foreground">${price.toFixed(2)}</span>
                          {live && (
                            <span className="ml-2 inline-block size-1.5 rounded-full bg-success align-middle" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div
                            className={`flex items-center justify-end gap-1 ${
                              change >= 0 ? "text-success" : "text-destructive"
                            }`}
                          >
                            {change >= 0 ? (
                              <ArrowUpRight className="size-4" />
                            ) : (
                              <ArrowDownRight className="size-4" />
                            )}
                            <span>
                              {change >= 0 ? "+" : ""}
                              {change.toFixed(2)} ({changePct >= 0 ? "+" : ""}
                              {changePct.toFixed(2)}%)
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-muted-foreground">
                          {volume.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "OPTIONS" && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Underlying</th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Type</th>
                  <th className="px-6 py-4 text-right text-sm text-muted-foreground">Strike</th>
                  <th className="px-6 py-4 text-right text-sm text-muted-foreground">Premium</th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Expires</th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {optionsLoading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 animate-pulse rounded bg-muted" />
                        </td>
                      ))}
                    </tr>
                  ))}
                {!optionsLoading &&
                  filteredOptions.map((option) => (
                    <tr
                      key={option.optionId}
                      className="border-b border-border transition-colors last:border-0 hover:bg-accent"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">{option.underlyingTicker}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            option.optionType === "CALL"
                              ? "bg-success/10 text-success"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {option.optionType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-foreground">
                        ${option.strikePrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-foreground">
                        ${option.premium.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">
                        {new Date(option.expiryTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            option.isActive
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {option.isActive ? "Active" : "Expired"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isLoading && !isError &&
        ((tab === "STOCKS" && filteredStocks.length === 0) ||
          (tab === "OPTIONS" && filteredOptions.length === 0)) && (
          <div className="mt-8 flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="size-6 opacity-40" />
            <span>No {tab === "STOCKS" ? "stocks" : "options"} found matching your search</span>
          </div>
        )}
    </div>
  );
}
