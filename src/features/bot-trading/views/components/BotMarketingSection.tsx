import { Bot, Clock, ShieldCheck, Zap, TrendingUp, ChevronRight } from "lucide-react";
import { FadeIn } from "@/shared/components/FadeIn";

const features = [
  {
    icon: Clock,
    title: "24 / 7 Execution",
    description: "The bot never sleeps. It monitors the market around the clock and executes orders the moment conditions are met.",
  },
  {
    icon: TrendingUp,
    title: "Rule-Based Strategy",
    description: "Trades are driven by configurable technical signals — no emotion, no hesitation, just consistent logic.",
  },
  {
    icon: Zap,
    title: "Instant Reaction",
    description: "React to price movements in milliseconds. Never miss a window because you were away from the screen.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Controls",
    description: "Built-in stop-loss and exposure limits protect your capital while the bot works.",
  },
];

type Props = {
  onStart: () => void;
};

export function BotMarketingSection({ onStart }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      {/* Hero */}
      <FadeIn>
        <div className="mb-8 flex flex-col items-center gap-6 text-center sm:mb-12">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-primary/10">
            <Bot className="size-10 text-primary" />
          </div>
          <div>
            <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-4xl">
              Let the bot trade{" "}
              <span className="bg-linear-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                while you sleep
              </span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground sm:text-lg">
              Automate your trading strategy with a rule-based bot that monitors markets, reacts to signals, and manages your positions — hands-free.
            </p>
          </div>
          <button
            onClick={onStart}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40 active:scale-95 sm:w-auto"
          >
            Start Bot Trading
            <ChevronRight className="size-5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </FadeIn>

      {/* Feature cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <FadeIn key={f.title} delay={100 + i * 60}>
              <div className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="mb-1 font-semibold">{f.title}</p>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
