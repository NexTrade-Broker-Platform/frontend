import { Newspaper } from "lucide-react";
import type { MarketStatus } from "@/features/markets/types/markets";
import { MarketStatusBadge } from "@/shared/components/MarketStatusBadge";

type Props = {
  eventCount: number;
  status: MarketStatus | undefined;
  fetchedAt: number;
};

export function NewsHeader({ eventCount, status, fetchedAt }: Props) {
  const isOpen = status?.isOpen ?? false;

  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Live Feed
        </p>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Market Events
          </h1>
        </div>
        <div className="mt-2">
          <MarketStatusBadge status={status} fetchedAt={fetchedAt} />
        </div>
      </div>

      {eventCount > 0 && (
        <div
          className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
            isOpen
              ? "bg-success/10 text-success"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <span
            className={`size-2 rounded-full ${
              isOpen ? "animate-pulse bg-success" : "bg-muted-foreground/40"
            }`}
          />
          {eventCount} event{eventCount !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
