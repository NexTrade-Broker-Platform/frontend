import {
  TrendingUp,
  TrendingDown,
  Zap,
  DollarSign,
  BarChart2,
  Globe,
  AlertTriangle,
  Bell,
  Power,
  PowerOff,
} from "lucide-react";
import type { MarketEvent } from "@/providers/NotificationProvider";

type EventStyle = {
  border: string;
  bg: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  Icon: React.ElementType;
};

function getEventStyle(eventType: string): EventStyle {
  const type = eventType.toUpperCase();

  if (type.includes("OPEN") || type.includes("BULL") || type.includes("SURGE") || type.includes("GAIN")) {
    return {
      border: "border-success/40",
      bg: "bg-success/5",
      iconBg: "bg-success/15",
      iconColor: "text-success",
      badgeBg: "bg-success/10",
      badgeText: "text-success",
      Icon: type.includes("OPEN") ? Power : TrendingUp,
    };
  }

  if (type.includes("CLOSE") || type.includes("BEAR") || type.includes("DROP") || type.includes("LOSS") || type.includes("CRASH")) {
    return {
      border: "border-destructive/40",
      bg: "bg-destructive/5",
      iconBg: "bg-destructive/15",
      iconColor: "text-destructive",
      badgeBg: "bg-destructive/10",
      badgeText: "text-destructive",
      Icon: type.includes("CLOSE") ? PowerOff : TrendingDown,
    };
  }

  if (type.includes("EARN") || type.includes("DIVIDEND") || type.includes("PROFIT")) {
    return {
      border: "border-violet-500/40",
      bg: "bg-violet-500/5",
      iconBg: "bg-violet-500/15",
      iconColor: "text-violet-400",
      badgeBg: "bg-violet-500/10",
      badgeText: "text-violet-400",
      Icon: DollarSign,
    };
  }

  if (type.includes("VOLAT") || type.includes("SPIKE") || type.includes("WARN")) {
    return {
      border: "border-amber-500/40",
      bg: "bg-amber-500/5",
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-400",
      badgeBg: "bg-amber-500/10",
      badgeText: "text-amber-400",
      Icon: AlertTriangle,
    };
  }

  if (type.includes("MACRO") || type.includes("GLOBAL") || type.includes("SECTOR")) {
    return {
      border: "border-sky-500/40",
      bg: "bg-sky-500/5",
      iconBg: "bg-sky-500/15",
      iconColor: "text-sky-400",
      badgeBg: "bg-sky-500/10",
      badgeText: "text-sky-400",
      Icon: Globe,
    };
  }

  if (type.includes("REPORT") || type.includes("STAT") || type.includes("DATA")) {
    return {
      border: "border-indigo-500/40",
      bg: "bg-indigo-500/5",
      iconBg: "bg-indigo-500/15",
      iconColor: "text-indigo-400",
      badgeBg: "bg-indigo-500/10",
      badgeText: "text-indigo-400",
      Icon: BarChart2,
    };
  }

  if (type.includes("SHOCK") || type.includes("FLASH") || type.includes("BREAK")) {
    return {
      border: "border-orange-500/40",
      bg: "bg-orange-500/5",
      iconBg: "bg-orange-500/15",
      iconColor: "text-orange-400",
      badgeBg: "bg-orange-500/10",
      badgeText: "text-orange-400",
      Icon: Zap,
    };
  }

  return {
    border: "border-border",
    bg: "bg-card",
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
    badgeBg: "bg-muted",
    badgeText: "text-muted-foreground",
    Icon: Bell,
  };
}

function formatLabel(eventType: string): string {
  return eventType
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatTime(marketTime: string): string {
  try {
    return new Date(marketTime).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return marketTime;
  }
}

type Props = {
  event: MarketEvent;
};

export function EventCard({ event }: Props) {
  const style = getEventStyle(event.event_type);
  const { Icon } = style;

  return (
    <article
      className={`flex flex-col gap-3 rounded-2xl border p-4 transition-shadow hover:shadow-lg ${style.border} ${style.bg}`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <div className={`flex size-9 items-center justify-center rounded-xl ${style.iconBg}`}>
          <Icon className={`size-5 ${style.iconColor}`} />
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${style.badgeBg} ${style.badgeText}`}
        >
          {formatLabel(event.event_type)}
        </span>
      </div>

      {/* Headline */}
      <p className="line-clamp-3 text-sm font-medium leading-snug text-foreground">
        {event.headline}
      </p>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
        <span className="truncate font-mono">{event.target || event.scope}</span>
        <span className="ml-2 shrink-0 tabular-nums">{formatTime(event.market_time)}</span>
      </div>
    </article>
  );
}
