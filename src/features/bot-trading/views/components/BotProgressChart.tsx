import { useEffect, useRef, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { wsClient } from "@/shared/lib/ws/wsClient";
import { getCurrentUserId } from "@/shared/lib/auth";

type EventType = "buy" | "sell" | "pump" | "event";

type EventDetail = {
  type: EventType;
  ticker?: string;     // buy / sell / pump: which stock
  eventType?: string;  // market event kind (e.g. "SECTOR_BOOM")
  target?: string;     // market event target ticker
};

type ProgressPoint = {
  index: number;
  time: string;
  total: number;
  cash: number;
  events?: EventDetail[];
};

// Bump to v2 — schema changed (event → events[])
export function getBotProgressStorageKey() {
  return `bot_progress_v2_${getCurrentUserId()}`;
}

type Props = {
  running: boolean;
  currentCash: number;
  livePositionsValue: number;
  spoofCommitted: number;
};

function fmtVal(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

const EVENT_COLORS: Record<EventType, string> = {
  buy:   "#22c55e",
  sell:  "#ef4444",
  pump:  "#f59e0b",
  event: "#a855f7",
};

function eventLabel(e: EventDetail): string {
  switch (e.type) {
    case "buy":   return e.ticker ? `Buy — ${e.ticker}`  : "Buy";
    case "sell":  return e.ticker ? `Sell — ${e.ticker}` : "Sell";
    case "pump":  return e.ticker ? `Pump — ${e.ticker}` : "Pump";
    case "event": {
      const parts = [e.eventType, e.target].filter(Boolean).join(" → ");
      return parts ? `Event: ${parts}` : "Event";
    }
  }
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload as ProgressPoint;
  const events = point.events ?? [];

  return (
    <div
      style={{
        backgroundColor: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        minWidth: 170,
      }}
    >
      <p style={{ color: "var(--color-muted-foreground)", fontSize: 11, marginBottom: 6 }}>
        {point.time}
      </p>
      <p style={{ marginBottom: 2 }}>
        Total: <strong>${point.total.toFixed(2)}</strong>
      </p>
      <p style={{ marginBottom: events.length ? 8 : 0 }}>
        Available Cash: <strong>${point.cash.toFixed(2)}</strong>
      </p>
      {events.length > 0 && (
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: 6,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {events.map((e, i) => (
            <p key={i} style={{ color: EVENT_COLORS[e.type], fontWeight: 600, margin: 0 }}>
              {eventLabel(e)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function BotProgressChart({ running, currentCash, livePositionsValue, spoofCommitted }: Props) {
  const [points, setPoints] = useState<ProgressPoint[]>(() => {
    try {
      const raw = localStorage.getItem(getBotProgressStorageKey());
      if (raw) return JSON.parse(raw) as ProgressPoint[];
    } catch {}
    return [];
  });

  // Array so multiple fills between ticks are all captured
  const pendingEventsRef = useRef<EventDetail[]>([]);
  const wasRunningRef    = useRef<boolean | null>(null);
  const cashRef          = useRef(currentCash);
  const posValueRef      = useRef(livePositionsValue);
  const spoofCommittedRef = useRef(spoofCommitted);

  cashRef.current         = currentCash;
  posValueRef.current     = livePositionsValue;
  spoofCommittedRef.current = spoofCommitted;

  useEffect(() => {
    localStorage.setItem(getBotProgressStorageKey(), JSON.stringify(points));
  }, [points]);

  // Reset on bot restart
  useEffect(() => {
    if (wasRunningRef.current === null) { wasRunningRef.current = running; return; }
    if (running && !wasRunningRef.current) {
      setPoints([]);
      pendingEventsRef.current = [];
    }
    wasRunningRef.current = running;
  }, [running]);

  // ORDER_UPDATE: pumps → immediate snapshot; fills → queue for 5s tick
  useEffect(() => {
    const handler = (payload: unknown) => {
      const p = payload as any;
      const orderType   = p.order_type   || p.orderType   || "";
      const side        = p.side         || "";
      const instrumentId = p.instrument_id || p.instrumentId || "";

      if (orderType === "LIMIT" && side === "BUY") {
        if (!running) return;
        const cash = cashRef.current;
        const time = new Date().toLocaleTimeString(undefined, {
          hour: "2-digit", minute: "2-digit", second: "2-digit",
        });
        setPoints((prev) => [
          ...prev.slice(-300),
          {
            index: Date.now(),
            time,
            total: cash + posValueRef.current,
            cash:  cash - spoofCommittedRef.current,
            events: [{ type: "pump", ticker: instrumentId || undefined }],
          },
        ]);
      } else if (p.status === "FILLED" || p.status === "PARTIALLY_FILLED") {
        pendingEventsRef.current.push({
          type:   side === "BUY" ? "buy" : "sell",
          ticker: instrumentId || undefined,
        });
      }
    };
    wsClient.subscribe("ORDER_UPDATE", handler);
    return () => wsClient.unsubscribe("ORDER_UPDATE", handler);
  }, [running]);

  // MARKET_EVENT → immediate snapshot with type + target
  useEffect(() => {
    const handler = (payload: any) => {
      if (!running) return;
      const evtType = payload?.event_type || "";
      if (["MARKET_OPEN", "MARKET_CLOSE", "TICK"].includes(evtType)) return;
      const cash = cashRef.current;
      const time = new Date().toLocaleTimeString(undefined, {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
      });
      setPoints((prev) => [
        ...prev.slice(-300),
        {
          index: Date.now(),
          time,
          total: cash + posValueRef.current,
          cash:  cash - spoofCommittedRef.current,
          events: [{ type: "event", eventType: evtType || undefined, target: payload?.target || undefined }],
        },
      ]);
    };
    wsClient.subscribe("MARKET_EVENT", handler);
    return () => wsClient.unsubscribe("MARKET_EVENT", handler);
  }, [running]);

  // 5s tick — drains all accumulated fill events into one point
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const cash   = cashRef.current;
      const time   = new Date().toLocaleTimeString(undefined, {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
      });
      const events = pendingEventsRef.current.length ? [...pendingEventsRef.current] : undefined;
      pendingEventsRef.current = [];
      setPoints((prev) => [
        ...prev.slice(-300),
        {
          index: Date.now(),
          time,
          total: cash + posValueRef.current,
          cash:  cash - spoofCommittedRef.current,
          events,
        },
      ]);
    }, 5000);
    return () => clearInterval(id);
  }, [running]);

  if (!running && points.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-sm font-semibold">Bot Progress</p>
        <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          Start the bot to see progress
        </div>
      </div>
    );
  }

  if (points.length < 2) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-sm font-semibold">Bot Progress</p>
        <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          Collecting data…
        </div>
      </div>
    );
  }

  const renderEventDot = (props: Record<string, unknown>) => {
    const arrayIndex = props.index as number;
    const point  = points[arrayIndex];
    const events = point?.events;
    if (!events?.length) return <g key={`nd-${arrayIndex}`} />;

    const cx    = props.cx as number;
    const cy    = props.cy as number;
    const color = EVENT_COLORS[events[0].type];

    if (events.length > 1) {
      // Donut shape signals "multiple events here"
      return (
        <g key={`d-${arrayIndex}`}>
          <circle cx={cx} cy={cy} r={7}  fill={color} stroke="var(--color-card)" strokeWidth={2} />
          <circle cx={cx} cy={cy} r={3}  fill="var(--color-card)" />
        </g>
      );
    }

    return (
      <circle
        key={`d-${arrayIndex}`}
        cx={cx} cy={cy} r={5}
        fill={color}
        stroke="var(--color-card)"
        strokeWidth={2}
      />
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold">Bot Progress</p>
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-green-500" /> Buy
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-red-500" /> Sell
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-amber-500" /> Pump
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-purple-500" /> Event
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={points} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />

          <XAxis
            dataKey="index"
            type="number"
            domain={["dataMin", "dataMax"]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickFormatter={(v: number) =>
              new Date(v).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
            }
            interval="preserveStartEnd"
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickFormatter={fmtVal}
            width={56}
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="total"
            stroke="var(--color-chart-1)"
            strokeWidth={2}
            dot={renderEventDot as never}
            activeDot={{ r: 4, strokeWidth: 0 }}
            name="total"
          />

          <Line
            type="monotone"
            dataKey="cash"
            stroke="var(--color-chart-4)"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
            name="cash"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
