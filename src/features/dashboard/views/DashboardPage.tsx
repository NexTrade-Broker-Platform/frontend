import { usePortfolio } from "@/features/portfolio/hooks/usePortfolio";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";
import { PortfolioValueChart } from "@/shared/components/PortfolioValueChart";
import { FadeIn } from "@/shared/components/FadeIn";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardStatCards } from "./components/DashboardStatCards";

export function DashboardPage() {
  const { data: portfolio, isLoading: portfolioLoading, isError: portfolioError } = usePortfolio();
  const { data: user, isLoading: userLoading } = useCurrentUser();

  const primaryBalance = portfolio?.cashBalances.find((b) => b.currency === "USD");
  const availableBalance = primaryBalance?.availableBalance ?? 0;
  const holdingsCount = portfolio?.holdings.length ?? 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <DashboardHeader
        firstName={user?.firstName}
        lastName={user?.lastName}
        isLoading={userLoading}
      />
      <DashboardStatCards
        availableBalance={availableBalance}
        holdingsCount={holdingsCount}
        isLoading={portfolioLoading}
        isError={portfolioError}
      />
      <FadeIn delay={200}>
        <PortfolioValueChart />
      </FadeIn>
    </div>
  );
}
