type Tab = "STOCKS" | "OPTIONS";

type MarketsTabBarProps = {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
};

export function MarketsTabBar({ tab, onTabChange }: MarketsTabBarProps) {
  return (
    <div className="mb-6 inline-flex rounded-lg border border-border bg-muted/50 p-1">
      <button
        onClick={() => onTabChange("STOCKS")}
        className={`rounded-md px-6 py-2 text-sm transition-colors ${
          tab === "STOCKS" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Stocks
      </button>
      <button
        onClick={() => onTabChange("OPTIONS")}
        className={`rounded-md px-6 py-2 text-sm transition-colors ${
          tab === "OPTIONS" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Options
      </button>
    </div>
  );
}
