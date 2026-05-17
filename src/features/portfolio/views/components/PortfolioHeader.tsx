type Props = {
  isError: boolean;
  errorMessage?: string;
};

export function PortfolioHeader({ isError, errorMessage }: Props) {
  return (
    <div className="mb-8">
      <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Account
      </p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Portfolio</h1>
      <p className="mt-2 text-muted-foreground">Track your holdings and performance</p>

      {isError && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <span>{errorMessage ?? "Failed to load portfolio"}</span>
        </div>
      )}
    </div>
  );
}
