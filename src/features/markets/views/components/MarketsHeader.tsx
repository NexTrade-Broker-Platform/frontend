import { EXCHANGE_NAME } from "@/app/config";

export function MarketsHeader() {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Live Market Data
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{EXCHANGE_NAME}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse and trade available instruments in real time
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
        <span className="size-2 animate-pulse rounded-full bg-success" />
        Live
      </div>
    </div>
  );
}
