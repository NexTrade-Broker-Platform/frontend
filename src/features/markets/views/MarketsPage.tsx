import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useMarkets } from "@/features/markets/hooks/useMarkets";
import { useOptions } from "@/features/markets/hooks/useOptions";
import { useMarketStatus } from "@/features/markets/hooks/useMarketStatus";
import { useNotifications } from "@/providers/NotificationProvider";
import { FadeIn } from "@/shared/components/FadeIn";
import { MarketsHeader } from "./components/MarketsHeader";
import { MarketsTabBar } from "./components/MarketsTabBar";
import { MarketsSearch } from "./components/MarketsSearch";
import { StocksTable } from "./components/StocksTable";
import { OptionsTable } from "./components/OptionsTable";

type Tab = "STOCKS" | "OPTIONS";

export function MarketsPage() {
  const [tab, setTab] = useState<Tab>("STOCKS");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: marketStatus, dataUpdatedAt } = useMarketStatus();
  const statusLoaded = !!marketStatus;

  const { data: stocks, isLoading: stocksLoading, isError: stocksError, error: stocksErr } = useMarkets({ limit: 50 }, { enabled: statusLoaded });
  const { data: options, isLoading: optionsLoading, isError: optionsError, error: optionsErr } = useOptions({ enabled: statusLoaded });
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

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setSearchTerm("");
  };

  return (
    <div className="p-4 lg:p-8">
      <FadeIn>
        <MarketsHeader status={marketStatus} fetchedAt={dataUpdatedAt} />
      </FadeIn>

      <FadeIn delay={100}>
        <MarketsTabBar tab={tab} onTabChange={handleTabChange} />
      </FadeIn>

      <FadeIn delay={175}>
        <MarketsSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={tab === "STOCKS" ? "Search by ticker, name or sector…" : "Search by ticker or type…"}
        />
      </FadeIn>

      {isError && (
        <FadeIn>
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="size-5 shrink-0" />
            <span>{(error as Error).message}</span>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={250}>
        {tab === "STOCKS" && (
          <StocksTable stocks={filteredStocks} isLoading={stocksLoading} priceUpdates={priceUpdates} />
        )}
        {tab === "OPTIONS" && (
          <OptionsTable options={filteredOptions} isLoading={optionsLoading} />
        )}

        {!isLoading && !isError &&
          ((tab === "STOCKS" && filteredStocks.length === 0) ||
            (tab === "OPTIONS" && filteredOptions.length === 0)) && (
            <div className="mt-8 flex flex-col items-center gap-2 text-muted-foreground">
              <span>No {tab === "STOCKS" ? "stocks" : "options"} found matching your search</span>
            </div>
          )}
      </FadeIn>
    </div>
  );
}
