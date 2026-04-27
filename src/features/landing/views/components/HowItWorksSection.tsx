import { StepCard } from "./StepCard";

const steps = [
  {
    number: "01",
    title: "Create your account",
    description: "Sign up and access your trading dashboard.",
  },
  {
    number: "02",
    title: "Deposit funds",
    description: "Add money to your wallet and prepare for trading.",
  },
  {
    number: "03",
    title: "Start investing",
    description: "Browse stocks, place orders, and grow your portfolio.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-card/30 py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <h2 className="mb-12 text-center text-3xl font-semibold">
          How it works
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
