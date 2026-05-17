import { Link, useParams } from "react-router";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useOption } from "@/features/markets/hooks/useOption";
import { usePortfolio } from "@/features/portfolio/hooks/usePortfolio";
import { useLivePrice } from "@/providers/NotificationProvider";
import { FadeIn } from "@/shared/components/FadeIn";
import { OptionContractHeader } from "@/features/markets/views/components/OptionContractHeader";
import { OptionContractInfoGrid } from "@/features/markets/views/components/OptionContractInfoGrid";
import { OptionContractOrderPanel } from "@/features/markets/views/components/OptionContractOrderPanel";
import { OptionContractPosition } from "@/features/markets/views/components/OptionContractPosition";

export function OptionContractDetailPage() {
  const { optionId } = useParams<{ optionId: string }>();
  const { data: option, isLoading, isError, error } = useOption(optionId);
  const { data: portfolio } = usePortfolio();
  const livePrice = useLivePrice(option?.underlyingTicker ?? "");

  const underlyingPrice = livePrice?.price;

  const holding = portfolio?.holdings.find(
    (h) => h.instrumentType === "OPTION" && h.ticker === optionId,
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !option) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-3 size-10 text-destructive" />
          <p className="mb-4 text-muted-foreground">
            {(error as Error)?.message ?? "Option contract not found"}
          </p>
          <Link to="/markets" className="text-primary hover:underline">
            Back to Markets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <FadeIn>
        <Link
          to="/markets"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Markets
        </Link>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: details */}
        <div className="lg:col-span-2">
          <FadeIn delay={75}>
            <OptionContractHeader option={option} />
          </FadeIn>

          <FadeIn delay={150}>
            <OptionContractInfoGrid option={option} underlyingPrice={underlyingPrice} />
          </FadeIn>

          {/* Mobile order panel */}
          <FadeIn delay={225} className="lg:hidden">
            <div className="mb-6">
              <OptionContractOrderPanel
                optionId={option.optionId}
                premium={option.premium}
                isActive={option.isActive}
                userQuantity={holding?.quantity ?? 0}
              />
            </div>
          </FadeIn>

          {/* Position card (if user holds this contract) */}
          {holding && (
            <FadeIn delay={300}>
              <OptionContractPosition holding={holding} option={option} />
            </FadeIn>
          )}
        </div>

        {/* Right: order panel (desktop sticky) */}
        <div className="hidden lg:block">
          <FadeIn delay={150}>
            <div className="sticky top-8 space-y-6">
              <OptionContractOrderPanel
                optionId={option.optionId}
                premium={option.premium}
                isActive={option.isActive}
                userQuantity={holding?.quantity ?? 0}
              />
              {holding && (
                <OptionContractPosition holding={holding} option={option} />
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
