import { useNavigate } from "react-router";
import { OpenAccountButton } from "./OpenAccountButton";
import { TypingHeadline } from "./TypingHeadline";

export function HeroContent() {
  const navigate = useNavigate();

  return (
    <section className="pb-10">
      <p
        className="mb-4 inline-flex animate-hero-in rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-success"
        style={{ animationDelay: "100ms" }}
      >
        Real-time market intelligence
      </p>
      <h1
        className="animate-hero-in text-4xl font-semibold leading-tight md:whitespace-nowrap md:text-5xl"
        style={{ animationDelay: "200ms" }}
      >
        <TypingHeadline />
      </h1>
      <p
        className="mt-5 max-w-xl animate-hero-in text-base text-muted-foreground md:text-lg"
        style={{ animationDelay: "300ms" }}
      >
        One workspace for scanning, charting, and order execution across equities.
        Built for speed, risk control, and confident decision-making.
      </p>
      <div
        className="mt-8 flex animate-hero-in flex-wrap gap-3"
        style={{ animationDelay: "400ms" }}
      >
        <OpenAccountButton />
        <button
          className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold transition hover:bg-accent hover:text-accent-foreground"
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
      </div>
    </section>
  );
}
