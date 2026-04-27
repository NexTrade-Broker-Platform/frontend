import type { LandingStat } from "@/features/landing/types/landing";

type ShowcaseStatCardProps = {
  stat: LandingStat;
};

export function ShowcaseStatCard({ stat }: ShowcaseStatCardProps) {
  return (
    <article className="text-center">
      <h3 className="text-2xl font-bold text-primary md:text-3xl">{stat.value}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
    </article>
  );
}