import { useMemo, useState } from "react";
import { Newspaper, Search, TrendingUp, Zap } from "lucide-react";
import { useNotifications } from "@/providers/NotificationProvider";
import { useMarketEvents } from "@/features/markets/hooks/useMarketEvents";

export function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { marketEvents: liveEvents } = useNotifications();
  const { data: historicalEvents = [] } = useMarketEvents();

  // Merge: live events first (newest), then historical — deduplicate by event_id
  const allEvents = useMemo(() => {
    const seen = new Set<string>();
    const merged = [...liveEvents, ...historicalEvents];
    return merged.filter((e) => {
      if (seen.has(e.event_id)) return false;
      seen.add(e.event_id);
      return true;
    });
  }, [liveEvents, historicalEvents]);

  const filtered = allEvents.filter(
    (e) =>
      e.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.target && e.target.toLowerCase().includes(searchTerm.toLowerCase())) ||
      e.scope.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2">Market Events</h1>
          <p className="text-muted-foreground">Live events from the exchange</p>
        </div>
        {allEvents.length > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs text-success">
            <span className="size-2 animate-pulse rounded-full bg-success" />
            {allEvents.length} event{allEvents.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-input bg-input-background py-3 pl-10 pr-4 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {allEvents.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-muted-foreground">
          <Newspaper className="size-12 opacity-30" />
          <p className="text-sm">Waiting for live market events…</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filtered.map((event) => (
            <div
              key={event.event_id}
              className="group rounded-xl border border-success/40 bg-success/5 p-6 transition-all hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex size-12 items-center justify-center rounded-lg bg-success/10">
                  <Zap className="size-6 text-success" />
                </div>
                <span className="rounded-full bg-success/10 px-3 py-1 text-xs text-success">
                  {event.event_type}
                </span>
              </div>
              <h3 className="mb-3 transition-colors group-hover:text-primary">{event.headline}</h3>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4" />
                  <span>{event.target || event.scope}</span>
                </div>
                <span>{event.market_time}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && allEvents.length > 0 && (
            <div className="col-span-2 text-center text-muted-foreground">
              No events match your search
            </div>
          )}
        </div>
      )}
    </div>
  );
}
