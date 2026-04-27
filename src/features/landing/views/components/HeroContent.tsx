import { useNavigate } from "react-router";
import { OpenAccountButton } from "./OpenAccountButton";

export function HeroContent() {
  const navigate = useNavigate();

  return (
    <section className="pb-10">
      <p className="mb-4 inline-flex rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-success">
        Real-time market intelligence
      </p>
      <h1 className="max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">
        Trade with clarity.
        <br />
        Execute with conviction.
      </h1>
      <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
        One workspace for scanning, charting, and order execution across equities.
        Built for speed, risk control, and confident decision-making.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
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
