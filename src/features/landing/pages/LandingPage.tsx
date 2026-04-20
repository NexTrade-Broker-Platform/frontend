import { useNavigate } from "react-router";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"></div>
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl"></div>
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 md:px-10 lg:px-12">
        <header className="mb-14 flex items-center justify-between rounded-2xl border border-border bg-card/80 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-300">
              LX
            </div>
            <p className="text-sm font-medium tracking-wide text-muted-foreground">
              Lynx Broker Platform
            </p>
          </div>
          <button
            className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </button>
        </header>

        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
              Real-time market intelligence
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-foreground md:text-5xl">
              Trade with clarity. Execute with conviction.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              One workspace for scanning, charting, and order execution across
              equities, FX, and crypto. Built for speed, risk control, and
              confident decision-making.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                onClick={() => navigate("/auth")}
              >
                Launch Dashboard
              </button>
              <button
                className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-accent hover:text-accent-foreground"
                onClick={() => navigate("/auth")}
              >
                See Demo
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-2xl shadow-primary/10 backdrop-blur">
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              Market Snapshot
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                <div>
                  <p className="text-sm text-muted-foreground">EUR/USD</p>
                  <p className="text-lg font-semibold text-foreground">
                    1.0872
                  </p>
                </div>
                <p className="text-sm font-semibold text-success">+0.42%</p>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                <div>
                  <p className="text-sm text-muted-foreground">BTC/USD</p>
                  <p className="text-lg font-semibold text-foreground">
                    72,418
                  </p>
                </div>
                <p className="text-sm font-semibold text-destructive">-1.07%</p>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                <div>
                  <p className="text-sm text-muted-foreground">NASDAQ 100</p>
                  <p className="text-lg font-semibold text-foreground">
                    18,554
                  </p>
                </div>
                <p className="text-sm font-semibold text-success">+0.63%</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-border bg-card/80 p-5">
            <h2 className="text-sm font-semibold text-primary">Smart Alerts</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Trigger alerts on volatility spikes, price breakouts, and order
              flow changes.
            </p>
          </article>
          <article className="rounded-xl border border-border bg-card/80 p-5">
            <h2 className="text-sm font-semibold text-primary">
              Risk Controls
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Configure guardrails with max drawdown, position limits, and
              real-time exposure checks.
            </p>
          </article>
          <article className="rounded-xl border border-border bg-card/80 p-5">
            <h2 className="text-sm font-semibold text-primary">
              Fast Execution
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Route orders through optimized venues with low-latency execution
              and clean audit trails.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
