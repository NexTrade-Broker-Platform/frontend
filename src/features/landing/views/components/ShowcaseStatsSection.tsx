import { LiveStockCard } from "./LiveStockCard";

type ShowcaseStatsSectionProps = {
  tickers: string[];
  isLoading: boolean;
};

export function ShowcaseStatsSection({
  tickers,
  isLoading,
}: ShowcaseStatsSectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-2xl shadow-primary/10 backdrop-blur animate-hero-in" style={{ animationDelay: "500ms" }}>
      <p className="mb-4 text-sm font-medium text-muted-foreground">
        Live Markets
      </p>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-15 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-col gap-2">
          {tickers.map((ticker) => (
            <LiveStockCard key={ticker} ticker={ticker} />
          ))}
        </div>
      )}
    </div>
  );
}
