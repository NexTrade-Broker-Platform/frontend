import { useLandingStocks } from "@/features/landing/hooks/useLandingStocks";
import { HeroContent } from "./HeroContent";
import { LandingNav } from "./LandingNav";
import { ShowcaseStatsSection } from "./ShowcaseStatsSection";

export function HeroSection() {
  const { tickers, isLoading } = useLandingStocks();

  return (
    <div className="relative overflow-hidden">
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-glow-cyan/20 blur-3xl" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">
        <LandingNav />
        <section className="grid items-center gap-14 pb-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <HeroContent />
          <ShowcaseStatsSection
            tickers={tickers}
            isLoading={isLoading}
          />
        </section>
      </div>
    </div>
  );
}
