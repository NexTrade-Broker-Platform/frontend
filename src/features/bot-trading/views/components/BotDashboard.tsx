import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Activity, Bot, CheckCircle2, PlayCircle, StopCircle,
  XCircle, Repeat2, DollarSign, TrendingUp, Wallet,
} from "lucide-react";
import { FadeIn } from "@/shared/components/FadeIn";
import { useBotStatus } from "@/features/bot-trading/hooks/useBotStatus";
import { useNotifications } from "@/providers/NotificationProvider";
import { useWalletBalance } from "@/features/wallet/hooks/useWalletBalance";
import { wsClient } from "@/shared/lib/ws/wsClient";
import { BotProgressChart } from "./BotProgressChart";

// ─── Log ────────────────────────────────────────────────────────────────────

type LogEntry = { id: number; time: string; message: string; type: "fill" | "cancel" | "info" };
type StoredLogState = { log: LogEntry[]; fillsCount: number; cancelsCount: number };

export const BOT_LOG_STORAGE_KEY = "bot_log_v1";

const INITIAL_LOG: LogEntry[] = [
  { id: 0, time: "", message: "Bot dashboard loaded. Start the bot to begin trading.", type: "info" },
];

function nowTime() {
  return new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

interface OrderUpdatePayload {
  order_id: string; status: string;
  filled_quantity: number; average_fill_price: number; exchange_fee: number;
  side?: string; order_type?: string; instrument_id?: string;
}

function formatOrderUpdate(p: OrderUpdatePayload): { message: string; type: LogEntry["type"] } {
  const id = p.order_id?.slice(0, 8) ?? "?";
  const ticker = p.instrument_id ?? "";
  const side = p.side ?? "";
  const orderType = p.order_type ?? "";
  const isPump = orderType === "LIMIT" && side === "BUY";
  const price = Number(p.average_fill_price).toFixed(2);
  const qty = p.filled_quantity;
  const typeTag = orderType ? ` [${orderType}]` : "";

  const tradeStr = ticker && side
    ? `${side} ${qty} ${ticker} @ $${price}${typeTag}`
    : `${qty} units @ $${price}${typeTag}`;

  switch (p.status) {
    case "FILLED":
      return {
        message: isPump ? `[PUMP] ${tradeStr} — filled` : `${tradeStr} — filled`,
        type: "fill",
      };
    case "PARTIALLY_FILLED":
      return {
        message: isPump ? `[PUMP] ${tradeStr} — partial fill` : `${tradeStr} — partial fill`,
        type: "fill",
      };
    case "CANCELLED":
      if (isPump && ticker) return { message: `[PUMP] Spoof order for ${ticker} cancelled`, type: "cancel" };
      return { message: `Order ${id} cancelled${ticker ? ` (${ticker}${side ? ` ${side}` : ""})` : ""}`, type: "cancel" };
    case "REJECTED":
      return { message: `Order ${id} rejected${ticker ? ` (${ticker})` : ""}`, type: "cancel" };
    case "EXPIRED":
      return { message: `Order ${id} expired${ticker ? ` (${ticker})` : ""}`, type: "cancel" };
    default:
      return { message: `Order ${id} → ${p.status}`, type: "info" };
  }
}

function fmt(n: number) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function readLogState(): StoredLogState & { nextId: number } {
  try {
    const raw = localStorage.getItem(BOT_LOG_STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as StoredLogState;
      if (saved?.log && Array.isArray(saved.log)) {
        return {
          ...saved,
          nextId: saved.log.length > 0 ? Math.max(...saved.log.map((e) => e.id)) + 1 : 1,
        };
      }
    }
  } catch {}
  return { log: INITIAL_LOG, fillsCount: 0, cancelsCount: 0, nextId: 1 };
}

// ─── Component ──────────────────────────────────────────────────────────────

type Props = { onDeactivate: () => void };

export function BotDashboard({ onDeactivate }: Props) {
  const { running, isLoading, isMutating, start, stop, startingSum, currentCash, positions } = useBotStatus();
  const queryClient = useQueryClient();
  const { priceUpdates } = useNotifications();
  const { data: walletData } = useWalletBalance("USD");
  const walletBalance = walletData?.wallet.availableBalance ?? 0;

  // Allocation input state (shown when bot is stopped and user wants to start)
  const [showAllocInput, setShowAllocInput] = useState(false);
  const [allocInput, setAllocInput] = useState("");
  const allocError = (() => {
    const n = parseFloat(allocInput);
    if (!allocInput) return "";
    if (isNaN(n) || n <= 0) return "Enter a positive amount.";
    if (n > walletBalance) return `Max available: $${fmt(walletBalance)}`;
    return "";
  })();

  const [fillsCount, setFillsCount]    = useState(() => readLogState().fillsCount);
  const [cancelsCount, setCancelsCount] = useState(() => readLogState().cancelsCount);
  const [log, setLog] = useState<LogEntry[]>(() => readLogState().log);
  const idRef = useRef(readLogState().nextId);

  // Persist log on every change
  useEffect(() => {
    localStorage.setItem(BOT_LOG_STORAGE_KEY, JSON.stringify({ log, fillsCount, cancelsCount }));
  }, [log, fillsCount, cancelsCount]);

  // WS subscription
  useEffect(() => {
    wsClient.start();
    const handler = (payload: unknown) => {
      const p = payload as OrderUpdatePayload;
      const { message, type } = formatOrderUpdate(p);
      const entry: LogEntry = { id: idRef.current++, time: nowTime(), message, type };
      setLog((prev) => [entry, ...prev].slice(0, 200));
      if (p.status === "FILLED" || p.status === "PARTIALLY_FILLED") setFillsCount((n) => n + 1);
      else if (["CANCELLED", "REJECTED", "EXPIRED"].includes(p.status)) setCancelsCount((n) => n + 1);
    };
    wsClient.subscribe("ORDER_UPDATE", handler);
    return () => wsClient.unsubscribe("ORDER_UPDATE", handler);
  }, []);

  // Log bot start/stop transitions
  const prevRunningRef = useRef<boolean | null>(null);
  useEffect(() => {
    if (isLoading) return;
    if (prevRunningRef.current === null) { prevRunningRef.current = running; return; }
    if (prevRunningRef.current === running) return;
    prevRunningRef.current = running;
    const entry: LogEntry = {
      id: idRef.current++, time: nowTime(),
      message: running ? "Bot started — monitoring market feed." : "Bot stopped.",
      type: "info",
    };
    setLog((prev) => [entry, ...prev].slice(0, 200));
  }, [running, isLoading]);

  // Positions live value
  const posEntries = Object.entries(positions);
  const livePositionsValue = posEntries.reduce((sum, [ticker, pos]) => {
    const live = priceUpdates[ticker];
    return sum + (live ? live.price * pos.quantity : pos.total_cost);
  }, 0);
  const totalInvested = posEntries.reduce((s, [, p]) => s + p.total_cost, 0);
  const totalPnl = livePositionsValue - totalInvested;
  const botNetValue = currentCash + livePositionsValue;
  const overallPnl = startingSum > 0 ? botNetValue - startingSum : 0;

  // Stop modal state
  const [showStopModal, setShowStopModal] = useState(false);
  const [isSelling, setIsSelling] = useState(false);

  // ── Start / stop ─────────────────────────────────────────────────────────
  const handleStartClick = () => {
    if (!showAllocInput) { setShowAllocInput(true); return; }
    const n = parseFloat(allocInput);
    if (isNaN(n) || n <= 0 || allocError) return;
    start(n);
    setShowAllocInput(false);
    setAllocInput("");
  };

  const handleStopClick = () => {
    if (posEntries.length > 0) { setShowStopModal(true); } else { stop(); }
  };

  const handleKeepAndStop = () => { setShowStopModal(false); stop(); };

  const handleSellAndStop = async () => {
    setIsSelling(true);
    try {
      // Build a map of actual portfolio quantities so we can cap sell orders correctly.
      const res = await fetch("/api/portfolio");
      const portfolioData = await res.json();
      const actualQty: Record<string, number> = {};
      for (const h of (portfolioData?.holdings ?? []) as Array<{ ticker: string; quantity: number }>) {
        actualQty[h.ticker] = h.quantity;
      }

      // For each ticker the bot tracked, sell min(bot_tracked_qty, actual_qty).
      // This leaves any manually bought shares of the same ticker untouched.
      const toSell = posEntries
        .map(([ticker, pos]) => ({
          ticker,
          quantity: Math.min(pos.quantity, actualQty[ticker] ?? 0),
        }))
        .filter((h) => h.quantity > 0);

      await Promise.all(
        toSell.map((h) =>
          fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              instrument_type: "STOCK",
              instrument_id: h.ticker,
              order_type: "MARKET",
              side: "SELL",
              quantity: h.quantity,
            }),
          })
        )
      );
    } catch (e) {
      console.error("Failed to sell positions:", e);
    }
    setShowStopModal(false);
    setIsSelling(false);
    stop();
    // Invalidate immediately and again after fills settle on the exchange (~2 s)
    queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    setTimeout(() => queryClient.invalidateQueries({ queryKey: ["portfolio"] }), 2500);
  };

  // ── Stat cards ───────────────────────────────────────────────────────────
  const stats = [
    {
      label: "Status",
      value: isLoading ? "…" : running ? "Running" : "Stopped",
      icon: Activity,
      color: running ? "text-success" : "text-muted-foreground",
      bg:    running ? "bg-success/10" : "bg-muted",
    },
    {
      label: "Starting Sum",
      value: startingSum > 0 ? `$${fmt(startingSum)}` : "—",
      icon: DollarSign,
      color: "text-muted-foreground",
      bg: "bg-muted",
    },
    {
      label: "Bot Cash",
      value: running || startingSum > 0 ? `$${fmt(currentCash)}` : "—",
      icon: Wallet,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Overall P&L",
      value: startingSum > 0 ? `${overallPnl >= 0 ? "+" : ""}$${fmt(overallPnl)}` : "—",
      icon: TrendingUp,
      color: startingSum > 0 ? (overallPnl >= 0 ? "text-success" : "text-destructive") : "text-muted-foreground",
      bg:    startingSum > 0 ? (overallPnl >= 0 ? "bg-success/10" : "bg-destructive/10") : "bg-muted",
    },
  ];

  const logStats = [
    { label: "Fills",    value: fillsCount,              icon: CheckCircle2, color: "text-primary",       bg: "bg-primary/10" },
    { label: "Cancels",  value: cancelsCount,             icon: XCircle,      color: cancelsCount > 0 ? "text-destructive" : "text-muted-foreground", bg: cancelsCount > 0 ? "bg-destructive/10" : "bg-muted" },
    { label: "Total",    value: fillsCount + cancelsCount, icon: Repeat2,     color: "text-chart-2",       bg: "bg-chart-2/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
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
            {running ? (
              <button
                onClick={handleStopClick}
                disabled={isLoading || isMutating}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-destructive/10 px-5 py-2.5 text-sm font-semibold text-destructive shadow-lg shadow-destructive/10 transition-all hover:bg-destructive/20 active:scale-95 disabled:opacity-60 sm:flex-none"
              >
                <StopCircle className="size-4" /> Stop Bot
              </button>
            ) : (
              <button
                onClick={handleStartClick}
                disabled={isLoading || isMutating || (showAllocInput && !!allocError)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-60 sm:flex-none"
              >
                <PlayCircle className="size-4" />
                {showAllocInput ? "Confirm" : "Start Bot"}
              </button>
            )}
          </div>
        </div>

        {/* Allocation input panel */}
        {!running && showAllocInput && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-4">
            <p className="mb-3 text-sm font-medium">Allocate funds to bot</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <input
                    type="number"
                    min="1"
                    step="100"
                    value={allocInput}
                    onChange={(e) => setAllocInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-border bg-background py-2 pl-7 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>
                {allocError && <p className="mt-1 text-xs text-destructive">{allocError}</p>}
                <p className="mt-1 text-xs text-muted-foreground">
                  Available in wallet: <span className="font-medium">${fmt(walletBalance)}</span>
                </p>
              </div>
              <button
                onClick={() => { setShowAllocInput(false); setAllocInput(""); }}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </FadeIn>

      {/* Main stat cards */}
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
                <p className={`text-lg font-bold tabular-nums sm:text-xl ${s.color}`}>{s.value}</p>
              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* Open positions */}
      {running && posEntries.length > 0 && (
        <FadeIn delay={100}>
          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-4 py-3 sm:px-5">
              <span className="text-sm font-semibold">Bot Positions</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/40">
                  <tr>
                    {["Ticker", "Qty", "Avg Cost", "Book Value", "Live Price", "Market Value", "P&L"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground first:text-left sm:px-5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posEntries.map(([ticker, pos]) => {
                    const live = priceUpdates[ticker];
                    const mktVal = live ? live.price * pos.quantity : null;
                    const pnl   = mktVal !== null ? mktVal - pos.total_cost : null;
                    return (
                      <tr key={ticker} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 sm:px-5">
                          <div className="flex items-center gap-2">
                            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                              {ticker.slice(0, 2)}
                            </div>
                            <span className="font-medium text-primary">{ticker}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums sm:px-5">{pos.quantity.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right tabular-nums sm:px-5">${fmt(pos.avg_cost)}</td>
                        <td className="px-4 py-3 text-right tabular-nums sm:px-5">${fmt(pos.total_cost)}</td>
                        <td className="px-4 py-3 text-right sm:px-5">
                          {live ? (
                            <div className="flex flex-col items-end">
                              <span className="tabular-nums">${fmt(live.price)}</span>
                              <span className={`text-xs tabular-nums ${live.change_pct >= 0 ? "text-success" : "text-destructive"}`}>
                                {live.change_pct >= 0 ? "+" : ""}{live.change_pct.toFixed(2)}%
                              </span>
                            </div>
                          ) : <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums sm:px-5">
                          {mktVal !== null ? `$${fmt(mktVal)}` : <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums sm:px-5">
                          {pnl !== null ? (
                            <span className={pnl >= 0 ? "text-success" : "text-destructive"}>
                              {pnl >= 0 ? "+" : "-"}${fmt(Math.abs(pnl))}
                            </span>
                          ) : <span className="text-muted-foreground">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border bg-muted/30">
                    <td colSpan={3} className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:px-5">Total</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-sm font-semibold sm:px-5">${fmt(totalInvested)}</td>
                    <td className="px-4 py-2.5 sm:px-5" />
                    <td className="px-4 py-2.5 text-right tabular-nums text-sm font-semibold sm:px-5">${fmt(livePositionsValue)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums sm:px-5">
                      <span className={totalPnl >= 0 ? "text-success font-semibold" : "text-destructive font-semibold"}>
                        {totalPnl >= 0 ? "+" : "-"}${fmt(Math.abs(totalPnl))}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </FadeIn>
      )}

      {/* Order stats + activity log */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {logStats.map((s, i) => {
          const Icon = s.icon;
          return (
            <FadeIn key={s.label} delay={150 + i * 50}>
              <div className="rounded-2xl border border-border bg-card p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
                  <div className={`flex size-7 items-center justify-center rounded-lg ${s.bg}`}>
                    <Icon className={`size-4 ${s.color}`} />
                  </div>
                </div>
                <p className={`text-xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
              </div>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={250}>
        <BotProgressChart
          running={running}
          currentCash={currentCash}
          livePositionsValue={livePositionsValue}
        />
      </FadeIn>

      <FadeIn delay={300}>
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
            <span className="text-sm font-semibold">Activity Log</span>
            <div className="flex items-center gap-3">
              {running && (
                <span className="flex items-center gap-1.5 text-xs text-success">
                  <span className="size-1.5 animate-pulse rounded-full bg-success" />
                  Live
                </span>
              )}
              <button
                onClick={() => { setLog([]); setFillsCount(0); setCancelsCount(0); idRef.current = 1; localStorage.removeItem(BOT_LOG_STORAGE_KEY); }}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear
              </button>
            </div>
          </div>
          <ul className="max-h-72 divide-y divide-border overflow-y-auto">
            {log.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-start gap-x-3 gap-y-0.5 px-4 py-3 text-sm sm:flex-nowrap sm:px-5">
                <span className="shrink-0 font-mono text-xs text-muted-foreground sm:mt-0.5">{entry.time}</span>
                <span className={
                  entry.type === "fill" ? "text-success" :
                  entry.type === "cancel" ? "text-destructive" :
                  "text-muted-foreground"
                }>
                  {entry.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>

      {/* Stop modal */}
      {showStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h3 className="mb-1 text-lg font-bold">Stop Bot</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              You have {posEntries.length} open position{posEntries.length !== 1 ? "s" : ""}. What would you like to do?
            </p>
            <div className="mb-4 overflow-hidden rounded-xl border border-border bg-muted/40">
              {posEntries.map(([ticker, pos]) => {
                const live = priceUpdates[ticker];
                const mktVal = live ? live.price * pos.quantity : pos.total_cost;
                return (
                  <div key={ticker} className="flex items-center justify-between border-b border-border px-4 py-2.5 text-sm last:border-0">
                    <span className="font-medium">{ticker}</span>
                    <span className="tabular-nums text-muted-foreground">{pos.quantity} shares</span>
                    <span className="tabular-nums font-semibold">${fmt(mktVal)}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleKeepAndStop}
                disabled={isSelling}
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-60"
              >
                Keep Positions &amp; Stop
              </button>
              <button
                onClick={handleSellAndStop}
                disabled={isSelling}
                className="flex-1 rounded-xl bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-60"
              >
                {isSelling ? "Selling…" : "Sell All & Stop"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
