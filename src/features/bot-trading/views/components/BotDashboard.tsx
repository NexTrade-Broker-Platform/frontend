import { useEffect, useRef, useState } from "react";
import { Activity, Bot, DollarSign, PlayCircle, StopCircle, TrendingUp, Repeat2 } from "lucide-react";
import { FadeIn } from "@/shared/components/FadeIn";

type LogEntry = { id: number; time: string; message: string; type: "buy" | "sell" | "info" };

function nowTime() {
  return new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const BUY_MESSAGES = [
  (t: string) => `Bought 2 shares of ${t} at market price`,
  (t: string) => `Entered long position on ${t}`,
  (t: string) => `Opened buy order for ${t}`,
];
const SELL_MESSAGES = [
  (t: string) => `Sold 2 shares of ${t} — profit taken`,
  (t: string) => `Closed position on ${t}`,
  (t: string) => `Exited ${t} — stop-loss triggered`,
];
const TICKERS = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "META", "GOOG"];

function randomMessage(): { message: string; type: "buy" | "sell"; income: number } {
  const ticker = TICKERS[Math.floor(Math.random() * TICKERS.length)];
  const isBuy = Math.random() > 0.45;
  const msgs = isBuy ? BUY_MESSAGES : SELL_MESSAGES;
  const income = isBuy ? 0 : parseFloat((Math.random() * 18 + 1).toFixed(2));
  return {
    message: msgs[Math.floor(Math.random() * msgs.length)](ticker),
    type: isBuy ? "buy" : "sell",
    income,
  };
}

type Props = {
  onDeactivate: () => void;
};

export function BotDashboard({ onDeactivate }: Props) {
  const [running, setRunning] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [tradesCount, setTradesCount] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([
    { id: 0, time: nowTime(), message: "Bot initialised. Press Start to begin trading.", type: "info" },
  ]);
  const idRef = useRef(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        const { message, type, income } = randomMessage();
        const entry: LogEntry = { id: idRef.current++, time: nowTime(), message, type };
        setLog((prev) => [entry, ...prev].slice(0, 50));
        if (income > 0) setTotalIncome((prev) => parseFloat((prev + income).toFixed(2)));
        setTradesCount((prev) => prev + 1);
      }, 2800);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const stats = [
    {
      label: "Total Income",
      value: `$${totalIncome.toFixed(2)}`,
      icon: DollarSign,
      color: totalIncome >= 0 ? "text-success" : "text-destructive",
      bg: totalIncome >= 0 ? "bg-success/10" : "bg-destructive/10",
    },
    {
      label: "Trades Executed",
      value: tradesCount,
      icon: Repeat2,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Win Rate",
      value: tradesCount === 0 ? "—" : `${Math.min(100, Math.round(55 + Math.random() * 10))}%`,
      icon: TrendingUp,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      label: "Status",
      value: running ? "Running" : "Stopped",
      icon: Activity,
      color: running ? "text-success" : "text-muted-foreground",
      bg: running ? "bg-success/10" : "bg-muted",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header row */}
      <FadeIn>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${running ? "bg-success/10" : "bg-muted"}`}>
              <Bot className={`size-5 transition-colors ${running ? "text-success" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Automated</p>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Bot Dashboard</h2>
            </div>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
            <button
              onClick={onDeactivate}
              className="flex-1 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:flex-none"
            >
              Deactivate
            </button>
            <button
              onClick={() => setRunning((r) => !r)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg transition-all active:scale-95 sm:flex-none ${
                running
                  ? "bg-destructive/10 text-destructive shadow-destructive/10 hover:bg-destructive/20"
                  : "bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90"
              }`}
            >
              {running ? (
                <><StopCircle className="size-4" /> Stop Bot</>
              ) : (
                <><PlayCircle className="size-4" /> Start Bot</>
              )}
            </button>
          </div>
        </div>
      </FadeIn>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <FadeIn key={s.label} delay={i * 50}>
              <div className="rounded-2xl border border-border bg-card p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between sm:mb-3">
                  <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
                  <div className={`flex size-7 items-center justify-center rounded-lg ${s.bg}`}>
                    <Icon className={`size-4 ${s.color}`} />
                  </div>
                </div>
                <p className={`text-xl font-bold tabular-nums sm:text-2xl ${s.color}`}>{s.value}</p>
              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* Activity log */}
      <FadeIn delay={200}>
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
            <span className="text-sm font-semibold">Activity Log</span>
            {running && (
              <span className="flex items-center gap-1.5 text-xs text-success">
                <span className="size-1.5 animate-pulse rounded-full bg-success" />
                Live
              </span>
            )}
          </div>
          <ul className="max-h-72 divide-y divide-border overflow-y-auto">
            {log.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-start gap-x-3 gap-y-0.5 px-4 py-3 text-sm sm:flex-nowrap sm:px-5">
                <span className="shrink-0 font-mono text-xs text-muted-foreground sm:mt-0.5">{entry.time}</span>
                <span
                  className={
                    entry.type === "buy"
                      ? "text-success"
                      : entry.type === "sell"
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }
                >
                  {entry.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>
    </div>
  );
}
