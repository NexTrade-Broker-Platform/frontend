import { OpenAccountButton } from "./OpenAccountButton";

export function CtaSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6 text-center md:px-10">
        <h2 className="mb-4 text-3xl font-semibold">Ready to start trading?</h2>
        <p className="mx-auto mb-8 max-w-md text-base text-muted-foreground">
          Join Lynx and explore a cleaner broker experience.
        </p>
        <OpenAccountButton label="Open Account" size="lg" />
      </div>
    </section>
  );
}
