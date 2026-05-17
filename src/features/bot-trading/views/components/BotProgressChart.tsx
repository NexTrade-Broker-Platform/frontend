import { useEffect, useRef, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { wsClient } from "@/shared/lib/ws/wsClient";

type EventType = "buy" | "sell" | "pump" | "event";

type ProgressPoint = {
  time: string;
  total: number;
  cash: number;
  event?: EventType;
};

type OrderPayload = {
  status: string;
  side?: string;
  order_type?: string;
};

export const BOT_PROGRESS_STORAGE_KEY = "bot_progress_v1";

type Props = {
  running: boolean;
  currentCash: number;
  livePositionsValue: number;
};

function fmtVal(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

const EVENT_COLORS: Record<EventType, string> = {
  buy: "#22c55e",
  sell: "#ef4444",
  pump: "#f59e0b",
  event: "#a855f7",
};

export function BotProgressChart({ running, currentCash, livePositionsValue }: Props) {
  const [points, setPoints] = useState<ProgressPoint[]>(() => {
    try {
      const raw = localStorage.getItem(BOT_PROGRESS_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as ProgressPoint[];
    } catch {}
    return [];
  });

  const pendingEventRef = useRef<EventType | null>(null);
  const wasRunningRef = useRef(false);
  const cashRef = useRef(currentCash);
  const posValueRef = useRef(livePositionsValue);

  // Keep refs in sync without affecting the interval
  cashRef.current = currentCash;
  posValueRef.current = livePositionsValue;

  // Persist points on every change
  useEffect(() => {
    localStorage.setItem(BOT_PROGRESS_STORAGE_KEY, JSON.stringify(points));
  }, [points]);

  // Reset chart on bot start
  useEffect(() => {
    if (running && !wasRunningRef.current) {
      setPoints([]);
      pendingEventRef.current = null;
    }
    wasRunningRef.current = running;
  }, [running]);

  // Capture ORDER_UPDATE events to mark on the chart
  useEffect(() => {
    const handler = (payload: unknown) => {
      const p = payload as OrderPayload;
      if (p.status !== "FILLED" && p.status !== "PARTIALLY_FILLED") return;
      if (p.order_type === "LIMIT" && p.side === "BUY") {
        pendingEventRef.current = "pump";
      } else if (p.side === "BUY") {
        pendingEventRef.current = "buy";
      } else if (p.side === "SELL") {
        pendingEventRef.current = "sell";
      }
    };
    wsClient.subscribe("ORDER_UPDATE", handler);
    return () => wsClient.unsubscribe("ORDER_UPDATE", handler);
  }, []);

  // Take an immediate snapshot when a market event fires
  useEffect(() => {
    const handler = () => {
      if (!running) return;
      const cash = cashRef.current;
      const total = cash + posValueRef.current;
      const time = new Date().toLocaleTimeString(undefined, {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
      });
      setPoints((prev) => [...prev.slice(-120), { time, total, cash, event: "event" }]);
    };
    wsClient.subscribe("MARKET_EVENT", handler);
    return () => wsClient.unsubscribe("MARKET_EVENT", handler);
  }, [running]);

  // Snapshot every 5 s while running — reads values from refs so the interval
  // is only created/destroyed when running changes, not on every price tick.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const cash = cashRef.current;
      const total = cash + posValueRef.current;
      const time = new Date().toLocaleTimeString(undefined, {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
      });
      const event = pendingEventRef.current ?? undefined;
      pendingEventRef.current = null;
      setPoints((prev) => [...prev.slice(-120), { time, total, cash, event }]);
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
    const index = props.index as number;
    const point = points[index];
    if (!point?.event) return <g key={`nd-${index}`} />;
    const color = EVENT_COLORS[point.event];
    return (
      <circle
        key={`d-${index}`}
        cx={props.cx as number}
        cy={props.cy as number}
        r={5}
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
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            interval="preserveStartEnd"
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickFormatter={fmtVal}
            width={56}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            }}
            labelStyle={{ color: "var(--color-muted-foreground)", fontSize: 11, marginBottom: 4 }}
            formatter={(value: unknown, name: unknown) => [
              `$${Number(value ?? 0).toFixed(2)}`,
              name === "total" ? "Total Value" : "Cash",
            ]}
          />

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
