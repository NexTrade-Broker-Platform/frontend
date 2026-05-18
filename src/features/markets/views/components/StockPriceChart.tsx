import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart2, Loader2, TrendingUp } from "lucide-react";
import { useLivePrice } from "@/providers/NotificationProvider";
import { useTheme } from "@/shared/providers/ThemeProvider";
import { useStockCandles } from "@/features/markets/hooks/useStockCandles";
import type { Candle } from "@/features/markets/types/markets";

type Period = "today" | "1w" | "1m" | "3m" | "1y" | "3y" | "all";
type ChartMode = "line" | "candle";

const PERIODS: { label: string; value: Period }[] = [
  { label: "Today", value: "today" },
  { label: "1W",    value: "1w"   },
  { label: "1M",    value: "1m"   },
  { label: "3M",    value: "3m"   },
  { label: "1Y",    value: "1y"   },
  { label: "3Y",    value: "3y"   },
  { label: "All",   value: "all"  },
];

const PAD = { top: 16, right: 72, bottom: 30, left: 8 };

function getDateRange(period: Period): { from: string; to: string } {
  const now = new Date();
  const to = now.toISOString().slice(0, 10);
  if (period === "today") return { from: to, to };
  if (period === "all")   return { from: "2000-01-01", to };
  const from = new Date(now);
  if      (period === "1w") from.setDate(from.getDate() - 7);
  else if (period === "1m") from.setMonth(from.getMonth() - 1);
  else if (period === "3m") from.setMonth(from.getMonth() - 3);
  else if (period === "1y") from.setFullYear(from.getFullYear() - 1);
  else if (period === "3y") from.setFullYear(from.getFullYear() - 3);
  return { from: from.toISOString().slice(0, 10), to };
}

function niceStep(range: number, targetTicks: number): number {
  const raw  = range / targetTicks;
  const exp  = Math.floor(Math.log10(raw));
  const frac = raw / 10 ** exp;
  const nice = frac < 1.5 ? 1 : frac < 3 ? 2 : frac < 7 ? 5 : 10;
  return nice * 10 ** exp;
}

function yTicks(min: number, max: number): number[] {
  if (min >= max) return [min];
  const step  = niceStep(max - min, 5);
  const start = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 0.1; v = +(v + step).toFixed(12)) {
    if (v >= min - step * 0.1) ticks.push(+v.toFixed(8));
  }
  return ticks;
}

function fmtPrice(p: number): string {
  if (p >= 10000) return (p / 1000).toFixed(1) + "k";
  if (p >= 1000)  return p.toFixed(0);
  if (p >= 100)   return p.toFixed(1);
  return p.toFixed(2);
}

function fmtXLabel(t: number, period: Period): string {
  const d = new Date(t * 1000);
  if (period === "today") return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (period === "1w" || period === "1m") return d.toLocaleDateString([], { month: "short", day: "numeric" });
  return d.toLocaleDateString([], { month: "short", year: "2-digit" });
}

function fmtHoverTime(t: number, period: Period): string {
  const d = new Date(t * 1000);
  if (period === "today") return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return d.toLocaleDateString([], { weekday: "short", year: "numeric", month: "short", day: "numeric" });
}

type Props = { ticker: string; change: number };

export function StockPriceChart({ ticker, change }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [period,     setPeriod]     = useState<Period>("all");
  const [mode,       setMode]       = useState<ChartMode>("candle");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [view,       setView]       = useState({ start: 0, end: 1 });
  const [size,       setSize]       = useState({ w: 0, h: 380 });

  const containerRef  = useRef<HTMLDivElement>(null);
  const dragRef       = useRef<{ clientX: number; start: number; end: number } | null>(null);
  const viewRef       = useRef(view);
  const chartWRef     = useRef(0);
  const nCandlesRef   = useRef(0);
  viewRef.current     = view;

  const { from, to } = getDateRange(period);
  const { data: candles, isLoading } = useStockCandles(ticker, from, to);
  const livePrice = useLivePrice(ticker);

  const displayCandles: Candle[] = useMemo(() => {
    if (!candles?.length) return candles ?? [];
    if (!livePrice) return candles;
    const copy = [...candles];
    const last = { ...copy[copy.length - 1] };
    last.close = livePrice.price;
    last.high  = Math.max(last.high, livePrice.price);
    last.low   = Math.min(last.low,  livePrice.price);
    copy[copy.length - 1] = last;
    return copy;
  }, [candles, livePrice]);

  nCandlesRef.current = displayCandles.length;

  useEffect(() => { setView({ start: 0, end: 1 }); }, [period]);

  // ResizeObserver to track actual container dimensions
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const chartW = size.w - PAD.left - PAD.right;
  const chartH = size.h - PAD.top - PAD.bottom;
  chartWRef.current = chartW;

  // Non-passive wheel handler so e.preventDefault() works
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const rect     = el.getBoundingClientRect();
      const relX     = Math.max(0, Math.min(chartWRef.current, e.clientX - rect.left - PAD.left));
      const curFrac  = relX / chartWRef.current;
      const v        = viewRef.current;
      const n        = nCandlesRef.current;
      if (n < 2) return;
      const range    = v.end - v.start;
      const factor   = e.deltaY > 0 ? 1.15 : 1 / 1.15;
      const minRange = Math.max(5 / n, 0.003);
      const newRange = Math.min(1, Math.max(minRange, range * factor));
      const anchor   = v.start + curFrac * range;
      let ns = anchor - curFrac * newRange;
      let ne = anchor + (1 - curFrac) * newRange;
      if (ns < 0) { ne -= ns; ns = 0; }
      if (ne > 1) { ns -= ne - 1; ne = 1; }
      setView({ start: Math.max(0, ns), end: Math.min(1, ne) });
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  // Release drag if mouse lifted outside the element
  useEffect(() => {
    const up = () => { dragRef.current = null; setIsDragging(false); };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  const visData = useMemo(() => {
    if (!displayCandles.length) return [] as Candle[];
    const n = displayCandles.length;
    const s = Math.max(0, Math.floor(view.start * n));
    const e = Math.min(n, Math.ceil(view.end * n));
    return displayCandles.slice(s, Math.max(s + 1, e));
  }, [displayCandles, view]);

  const [priceMin, priceMax] = useMemo(() => {
    if (!visData.length) return [0, 100];
    let lo = Infinity, hi = -Infinity;
    for (const c of visData) {
      lo = Math.min(lo, mode === "candle" ? c.low  : c.close);
      hi = Math.max(hi, mode === "candle" ? c.high : c.close);
    }
    const pad = (hi - lo) * 0.08 || 2;
    return [lo - pad, hi + pad];
  }, [visData, mode]);

  // Inline coordinate helpers — used at render time with current state
  const toX = (i: number) => PAD.left + (i + 0.5) / visData.length * chartW;
  const toY = (p: number) => PAD.top  + (priceMax - p) / (priceMax - priceMin) * chartH;

  // Pre-computed SVG paths for line chart (memoized)
  const [linePath, areaPath] = useMemo(() => {
    if (visData.length < 2) return ["", ""];
    const n    = visData.length;
    const tx   = (i: number) => PAD.left + (i + 0.5) / n * chartW;
    const ty   = (p: number) => PAD.top  + (priceMax - p) / (priceMax - priceMin) * chartH;
    const lp   = visData.map((c, i) => `${i === 0 ? "M" : "L"}${tx(i).toFixed(1)},${ty(c.close).toFixed(1)}`).join(" ");
    const bot  = (PAD.top + chartH).toFixed(1);
    const ap   = `${lp} L${tx(n - 1).toFixed(1)},${bot} L${tx(0).toFixed(1)},${bot} Z`;
    return [lp, ap];
  }, [visData, priceMin, priceMax, chartW, chartH]);

  const yTickVals = useMemo(() => yTicks(priceMin, priceMax), [priceMin, priceMax]);

  const xTickIdxs = useMemo(() => {
    const n = visData.length;
    if (!n) return [] as number[];
    const count = Math.min(6, n);
    if (count <= 1) return [0];
    return Array.from({ length: count }, (_, i) => Math.round(i / (count - 1) * (n - 1)));
  }, [visData.length]);

  // Theme-derived colors
  const gridColor      = isDark ? "#1e2028" : "#f1f5f9";
  const textColor      = isDark ? "#6b7280" : "#94a3b8";
  const crosshairColor = isDark ? "#374151" : "#cbd5e1";
  const labelBg        = isDark ? "#1f2937" : "#475569";
  const lineColor      = change >= 0 ? "#6366f1" : "#ef4444";
  const gradId         = `cg-${ticker}`;
  const clipId         = `cc-${ticker}`;

  // Resolved hover values — always up-to-date with latest visData
  const hoveredCandle = hoveredIdx !== null
    ? visData[Math.min(hoveredIdx, visData.length - 1)] ?? null
    : null;
  const hx = hoveredCandle ? toX(hoveredIdx!) : 0;
  const hy = hoveredCandle ? toY(hoveredCandle.close) : 0;

  function handleMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return;
    dragRef.current = { clientX: e.clientX, start: view.start, end: view.end };
    setIsDragging(true);
  }

  function handleMouseMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const svgX = e.clientX - rect.left;

    if (dragRef.current) {
      const dx    = e.clientX - dragRef.current.clientX;
      const range = dragRef.current.end - dragRef.current.start;
      const delta = (dx / chartW) * range;
      let ns = dragRef.current.start - delta;
      let ne = dragRef.current.end   - delta;
      if (ns < 0) { ne -= ns; ns = 0; }
      if (ne > 1) { ns -= ne - 1; ne = 1; }
      setView({ start: Math.max(0, ns), end: Math.min(1, ne) });
      setHoveredIdx(null);
      return;
    }

    if (svgX < PAD.left || svgX > PAD.left + chartW || !visData.length) {
      setHoveredIdx(null);
      return;
    }
    const idx = Math.max(0, Math.min(visData.length - 1, Math.floor((svgX - PAD.left) / (chartW / visData.length))));
    setHoveredIdx(idx);
  }

  function handleMouseLeave() {
    dragRef.current = null;
    setIsDragging(false);
    setHoveredIdx(null);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      {/* Period + mode toggles */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-0.5 rounded-lg bg-muted/50 p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                period === p.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-0.5 rounded-lg bg-muted/50 p-1">
          <button
            onClick={() => setMode("line")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "line" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingUp className="size-3.5" />
            Line
          </button>
          <button
            onClick={() => setMode("candle")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "candle" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart2 className="size-3.5" />
            Candle
          </button>
        </div>
      </div>

      {/* Hover info bar */}
      <div className="mb-3 h-6 text-sm">
        {hoveredCandle ? (
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-muted-foreground">{fmtHoverTime(hoveredCandle.time, period)}</span>
            {mode === "line" ? (
              <span className="font-medium text-foreground">${hoveredCandle.close.toFixed(2)}</span>
            ) : (
              <>
                <span className="text-muted-foreground">O <span className="text-foreground">${hoveredCandle.open.toFixed(2)}</span></span>
                <span className="text-muted-foreground">H <span className="text-success">${hoveredCandle.high.toFixed(2)}</span></span>
                <span className="text-muted-foreground">L <span className="text-destructive">${hoveredCandle.low.toFixed(2)}</span></span>
                <span className="text-muted-foreground">C <span className="text-foreground">${hoveredCandle.close.toFixed(2)}</span></span>
              </>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Scroll to zoom · Drag to pan</span>
        )}
      </div>

      {/* Chart */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-card/80 backdrop-blur-sm">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        )}
        {!isLoading && !visData.length && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">No data available for this period</span>
          </div>
        )}
        <div
          ref={containerRef}
          className="h-95 w-full select-none overflow-hidden"
          style={{ cursor: isDragging ? "grabbing" : "crosshair" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <svg width={size.w} height={size.h}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={lineColor} stopOpacity={0.2} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0.01} />
              </linearGradient>
              <clipPath id={clipId}>
                <rect x={PAD.left} y={PAD.top - 4} width={chartW} height={chartH + 8} />
              </clipPath>
            </defs>

            {/* Horizontal grid lines + Y axis labels */}
            {yTickVals.map((price) => {
              const y = toY(price);
              if (y < PAD.top - 1 || y > PAD.top + chartH + 1) return null;
              return (
                <g key={price}>
                  <line
                    x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y}
                    stroke={gridColor} strokeWidth={1}
                  />
                  <text
                    x={PAD.left + chartW + 6} y={y}
                    dominantBaseline="middle" textAnchor="start"
                    fontSize={10} fill={textColor}
                    fontFamily="ui-monospace,monospace"
                  >
                    {fmtPrice(price)}
                  </text>
                </g>
              );
            })}

            {/* X axis labels */}
            {xTickIdxs.map((i) => {
              const c = visData[i];
              if (!c) return null;
              return (
                <text
                  key={i}
                  x={toX(i)} y={PAD.top + chartH + 18}
                  textAnchor="middle" fontSize={10} fill={textColor}
                  fontFamily="ui-sans-serif,sans-serif"
                >
                  {fmtXLabel(c.time, period)}
                </text>
              );
            })}

            {/* Bottom axis line */}
            <line
              x1={PAD.left} y1={PAD.top + chartH}
              x2={PAD.left + chartW} y2={PAD.top + chartH}
              stroke={gridColor} strokeWidth={1}
            />

            {/* Clipped chart content */}
            <g clipPath={`url(#${clipId})`}>
              {mode === "line" ? (
                <>
                  {areaPath && <path d={areaPath} fill={`url(#${gradId})`} />}
                  {linePath  && (
                    <path
                      d={linePath} fill="none"
                      stroke={lineColor} strokeWidth={2}
                      strokeLinejoin="round" strokeLinecap="round"
                    />
                  )}
                </>
              ) : (
                visData.map((c, i) => {
                  const cw      = Math.max(1, chartW / visData.length);
                  const bodyW   = Math.max(1, cw * 0.65);
                  const cx      = toX(i);
                  const isUp    = c.close >= c.open;
                  const color   = isUp ? "#10b981" : "#ef4444";
                  const bodyTop = toY(Math.max(c.open, c.close));
                  const bodyBot = toY(Math.min(c.open, c.close));
                  const bodyH   = Math.max(1, bodyBot - bodyTop);
                  return (
                    <g key={c.time}>
                      <line
                        x1={cx} y1={toY(c.high)} x2={cx} y2={toY(c.low)}
                        stroke={color} strokeWidth={Math.max(1, cw * 0.12)}
                      />
                      <rect
                        x={cx - bodyW / 2} y={bodyTop}
                        width={bodyW} height={bodyH}
                        fill={color} rx={cw > 8 ? 1.5 : 0}
                      />
                    </g>
                  );
                })
              )}
            </g>

            {/* Crosshair */}
            {hoveredCandle && (
              <>
                <line
                  x1={hx} y1={PAD.top} x2={hx} y2={PAD.top + chartH}
                  stroke={crosshairColor} strokeWidth={1} strokeDasharray="3 3"
                />
                <line
                  x1={PAD.left} y1={hy} x2={PAD.left + chartW} y2={hy}
                  stroke={crosshairColor} strokeWidth={1} strokeDasharray="3 3"
                />
                {/* Price label pill on right axis */}
                <rect
                  x={PAD.left + chartW + 2} y={hy - 9}
                  width={64} height={18}
                  fill={labelBg} rx={3}
                />
                <text
                  x={PAD.left + chartW + 34} y={hy}
                  dominantBaseline="middle" textAnchor="middle"
                  fontSize={10} fill="#fff"
                  fontFamily="ui-monospace,monospace"
                >
                  {fmtPrice(hoveredCandle.close)}
                </text>
                {mode === "line" && (
                  <circle
                    cx={hx} cy={hy} r={4}
                    fill={lineColor}
                    stroke={isDark ? "#111827" : "#ffffff"} strokeWidth={2}
                  />
                )}
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
