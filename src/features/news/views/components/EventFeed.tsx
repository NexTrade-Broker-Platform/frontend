import { Newspaper } from "lucide-react";
import type { MarketEvent } from "@/providers/NotificationProvider";
import { FadeIn } from "@/shared/components/FadeIn";
import { EventCard } from "./EventCard";

type Props = {
  events: MarketEvent[];
  allEventsCount: number;
};

export function EventFeed({ events, allEventsCount }: Props) {
  if (allEventsCount === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-muted-foreground">
        <Newspaper className="size-12 opacity-30" />
        <p className="text-sm">Waiting for live market events…</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No events match your search.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {events.map((event, i) => (
        <FadeIn key={event.event_id} delay={i * 40}>
          <EventCard event={event} />
        </FadeIn>
      ))}
    </div>
  );
}
