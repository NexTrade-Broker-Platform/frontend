function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

type DashboardHeaderProps = {
  firstName?: string;
  lastName?: string;
  isLoading: boolean;
};

export function DashboardHeader({ firstName, lastName, isLoading }: DashboardHeaderProps) {
  return (
    <div className="mb-8 animate-hero-in">
      <h1 className="mb-1 text-2xl font-semibold md:text-3xl">
        {isLoading ? (
          <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
        ) : (
          <>{greeting()}, {firstName} {lastName}!</>
        )}
      </h1>
      <p className="text-sm text-muted-foreground">Here&apos;s your portfolio overview</p>
    </div>
  );
}
