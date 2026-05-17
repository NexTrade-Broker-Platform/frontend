import { useMemo } from "react";
import { usePortfolio } from "@/features/portfolio/hooks/usePortfolio";
import { PortfolioValueChart } from "@/shared/components/PortfolioValueChart";
import { FadeIn } from "@/shared/components/FadeIn";
import { PortfolioHeader } from "./components/PortfolioHeader";
import { PortfolioPositionCards } from "./components/PortfolioPositionCards";
import { StockHoldingsTable } from "./components/StockHoldingsTable";
import { ContractHoldingsList } from "./components/ContractHoldingsList";

export function PortfolioPage() {
  const { data: portfolio, isLoading, isError, error } = usePortfolio();

  const holdings = portfolio?.holdings ?? [];

  const { stockHoldings, contractHoldings, totalCost } = useMemo(() => {
    const stocks = holdings.filter((h) => h.instrumentType === "STOCK");
    const contracts = holdings.filter((h) => h.instrumentType !== "STOCK");
    const total = holdings.reduce((s, h) => s + h.totalCost, 0);
    return { stockHoldings: stocks, contractHoldings: contracts, totalCost: total };
  }, [holdings]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <FadeIn>
        <PortfolioHeader
          isError={isError}
          errorMessage={(error as Error | null)?.message}
        />
      </FadeIn>

      <FadeIn delay={75}>
        <PortfolioPositionCards holdings={holdings} isLoading={isLoading} />
      </FadeIn>

      <FadeIn delay={150}>
        <div className="mb-6">
          <PortfolioValueChart />
        </div>
      </FadeIn>

      <FadeIn delay={200}>
        <StockHoldingsTable
          holdings={stockHoldings}
          totalCost={totalCost}
          isLoading={isLoading}
        />
      </FadeIn>

      <FadeIn delay={250}>
        <ContractHoldingsList
          holdings={contractHoldings}
          totalCost={totalCost}
          isLoading={isLoading}
        />
      </FadeIn>
    </div>
  );
}
