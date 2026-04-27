import { AlertCircle } from "lucide-react";
import { ShowcaseStatCard } from "./ShowcaseStatCard";

type ShowcaseStatsSectionProps = {
  stats: Array<{ label: string; value: string }>;
  isLoading: boolean;
  isError: boolean;
};

export function ShowcaseStatsSection({
  stats,
  isLoading,
  isError,
}: ShowcaseStatsSectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-2xl shadow-primary/10 backdrop-blur">
      <p className="mb-6 text-sm font-medium text-muted-foreground">
        Market Stats
      </p>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <AlertCircle className="h-8 w-8 text-destructive/60" />
          <p className="text-sm font-medium text-destructive">
            Failed to load stats
          </p>
          <p className="text-xs text-muted-foreground">
            Market statistics are temporarily unavailable.
          </p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <ShowcaseStatCard key={stat.label} stat={stat} />
          ))}
        </div>
      )}
    </div>
  );
}
