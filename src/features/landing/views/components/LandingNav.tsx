import { useNavigate } from "react-router";
import { TrendingUp } from "lucide-react";
import { OpenAccountButton } from "./OpenAccountButton";

export function LandingNav() {
  const navigate = useNavigate();

  return (
    <header className="mb-14 flex items-center justify-between rounded-2xl border border-border bg-card/80 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <span className="text-sm font-semibold tracking-wide">Lynx Broker</span>
      </div>
      <div className="flex gap-2">
        <button
          className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:bg-accent hover:text-accent-foreground"
          onClick={() => navigate("/auth")}
        >
          Log in
        </button>
        <OpenAccountButton size="sm" />
      </div>
    </header>
  );
}
