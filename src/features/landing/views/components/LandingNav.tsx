import { useNavigate } from "react-router";
import { APP_NAME } from "@/app/config";
import { OpenAccountButton } from "./OpenAccountButton";
import logo from "@/assets/logo.svg";

export function LandingNav() {
  const navigate = useNavigate();

  return (
    <header className="mb-14 flex items-center justify-between rounded-2xl border border-border bg-card/80 px-4 py-3 backdrop-blur md:px-6 animate-hero-in">
      <div className="flex items-center gap-3">
        <img src={logo} alt={APP_NAME} className="h-8 w-8" />
        <span className="hidden text-sm font-semibold tracking-wide sm:block">{APP_NAME}</span>
      </div>
      <div className="flex gap-2">
        <button
          className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:bg-accent hover:text-accent-foreground"
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
        <div className="hidden sm:block">
          <OpenAccountButton size="sm" />
        </div>
      </div>
    </header>
  );
}
