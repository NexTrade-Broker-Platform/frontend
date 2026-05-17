import { useMemo, useState } from "react";
import { useNotifications } from "@/providers/NotificationProvider";
import { useMarketEvents } from "@/features/markets/hooks/useMarketEvents";
import { useMarketStatus } from "@/features/markets/hooks/useMarketStatus";
import { FadeIn } from "@/shared/components/FadeIn";
import { NewsHeader } from "./components/NewsHeader";
import { NewsSearchBar } from "./components/NewsSearchBar";
import { EventFeed } from "./components/EventFeed";

export function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { marketEvents: liveEvents } = useNotifications();
  const { data: historicalEvents = [] } = useMarketEvents();
  const { data: marketStatus, dataUpdatedAt } = useMarketStatus();

  const allEvents = useMemo(() => {
    const seen = new Set<string>();
    return [...liveEvents, ...historicalEvents].filter((e) => {
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
      <FadeIn>
        <NewsHeader
          eventCount={allEvents.length}
          status={marketStatus}
          fetchedAt={dataUpdatedAt}
        />
      </FadeIn>

      <FadeIn delay={100}>
        <div className="mb-6">
          <NewsSearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </FadeIn>

      <FadeIn delay={175}>
        <EventFeed events={filtered} allEventsCount={allEvents.length} />
      </FadeIn>
    </div>
  );
}
