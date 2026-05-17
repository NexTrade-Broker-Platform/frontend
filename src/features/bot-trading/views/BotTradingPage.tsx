import { useState } from "react";
import { Bot } from "lucide-react";
import { FadeIn } from "@/shared/components/FadeIn";
import { BotMarketingSection } from "./components/BotMarketingSection";
import { BotRiskConfirmation } from "./components/BotRiskConfirmation";
import { BotDashboard, BOT_LOG_STORAGE_KEY } from "./components/BotDashboard";
import { BotDeactivateConfirmation } from "./components/BotDeactivateConfirmation";
import { BOT_PROGRESS_STORAGE_KEY } from "./components/BotProgressChart";

type View = "marketing" | "confirm" | "dashboard" | "deactivate-confirm";

const STORAGE_KEY = "bot_trading_accepted";

function getInitialView(): View {
  return localStorage.getItem(STORAGE_KEY) === "true"
    ? "dashboard"
    : "marketing";
}

export function BotTradingPage() {
  const [view, setView] = useState<View>(getInitialView);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setView("dashboard");
  };

  const handleDeactivateConfirmed = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BOT_LOG_STORAGE_KEY);
    localStorage.removeItem(BOT_PROGRESS_STORAGE_KEY);
    setView("marketing");
  };

  return (
    <div className="p-4 lg:p-8">
      {view !== "dashboard" && view !== "deactivate-confirm" && (
        <FadeIn>
          <div className="mb-8">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Automated
            </p>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Bot Trading
              </h1>
            </div>
          </div>
        </FadeIn>
      )}

      {view === "marketing" && (
        <BotMarketingSection onStart={() => setView("confirm")} />
      )}
      {view === "confirm" && (
        <BotRiskConfirmation
          onAccept={handleAccept}
          onBack={() => setView("marketing")}
        />
      )}
      {view === "dashboard" && <BotDashboard onDeactivate={() => setView("deactivate-confirm")} />}
      {view === "deactivate-confirm" && (
        <BotDeactivateConfirmation
          onConfirm={handleDeactivateConfirmed}
          onBack={() => setView("dashboard")}
        />
      )}
    </div>
  );
}
