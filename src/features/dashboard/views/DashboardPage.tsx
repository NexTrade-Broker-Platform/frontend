import { usePortfolio } from "@/features/portfolio/hooks/usePortfolio";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardStatCards } from "./components/DashboardStatCards";
import { PortfolioValueChart } from "./components/PortfolioValueChart";

export function DashboardPage() {
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio();
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
      />
      <PortfolioValueChart
        portfolio={portfolio}
        isLoading={portfolioLoading}
      />
    </div>
  );
}
