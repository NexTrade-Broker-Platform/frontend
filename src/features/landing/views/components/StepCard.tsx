type StepCardProps = {
  number: string;
  title: string;
  description: string;
};

export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <article className="rounded-xl border border-border bg-card p-6">
      <span className="mb-4 block text-4xl font-bold text-primary/30">{number}</span>
      <h3 className="mb-2 text-base font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </article>
  );
}