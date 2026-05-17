import type { MarketStatus } from "@/features/markets/types/markets";
import { MarketClock } from "@/features/markets/views/components/MarketClock";

type Props = {
  status: MarketStatus | undefined;
  fetchedAt: number;
};

export function MarketStatusBadge({ status, fetchedAt }: Props) {
  const isOpen = status?.isOpen ?? false;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      {!status ? (
        <div className="h-5 w-48 animate-pulse rounded bg-muted" />
      ) : (
        <>
          <span
            className={`inline-flex items-center gap-1.5 font-medium ${
              isOpen ? "text-success" : "text-destructive"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                isOpen ? "animate-pulse bg-success" : "bg-destructive/60"
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
        </>
      )}
    </div>
  );
}
