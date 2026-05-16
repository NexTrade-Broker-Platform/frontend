import { EXCHANGE_NAME } from "@/app/config";
import type { MarketStatus } from "@/features/markets/types/markets";
import { MarketClock } from "./MarketClock";

type Props = {
  status: MarketStatus | undefined;
  fetchedAt: number;
};

export function MarketsHeader({ status, fetchedAt }: Props) {
  const isOpen = status?.isOpen ?? false;

  return (
    <div className="mb-8">
      <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Live Market Data
      </p>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{EXCHANGE_NAME}</h1>

          {!status ? (
            <div className="mt-2 h-5 w-64 animate-pulse rounded bg-muted" />
          ) : (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span
                className={`inline-flex items-center gap-1.5 font-medium ${
                  isOpen ? "text-success" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`size-2 rounded-full ${
                    isOpen ? "animate-pulse bg-success" : "bg-muted-foreground/40"
                  }`}
                />
                {isOpen ? "Market Open" : "Market Closed"}
              </span>

              {status.marketTime && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="text-muted-foreground">
                    <MarketClock
                      marketTime={status.marketTime}
                      speedMultiplier={status.speedMultiplier ?? 1}
                      fetchedAt={fetchedAt}
                    />
                  </span>
                  {status.speedMultiplier && status.speedMultiplier !== 1 && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                      {status.speedMultiplier}×
                    </span>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div
          className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
            isOpen ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
          }`}
        >
          <span
            className={`size-2 rounded-full ${
              isOpen ? "animate-pulse bg-success" : "bg-muted-foreground/40"
            }`}
          />
          {status ? (isOpen ? "Live" : "Offline") : "—"}
        </div>
      </div>
    </div>
  );
}
