import { LineChart, BarChart2, Zap } from "lucide-react";
import { APP_NAME } from "@/app/config";
import { FadeIn } from "@/shared/components/FadeIn";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: LineChart,
    title: "Live market data",
    description: "Follow stock prices and market movement in real time.",
  },
  {
    icon: BarChart2,
    title: "Portfolio overview",
    description: "Track holdings, balances, and average cost in one place.",
  },
  {
    icon: Zap,
    title: "Fast order flow",
    description: "Place and monitor market or limit orders with ease.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <FadeIn className="mb-12">
          <h2 className="text-center text-3xl font-semibold">Why {APP_NAME}</h2>
        </FadeIn>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 100}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
