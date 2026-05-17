import { Link } from "react-router";
import { ExternalLink } from "lucide-react";
import type { Option } from "@/features/markets/types/markets";

type Props = {
  option: Option;
  underlyingPrice?: number;
};

function StatCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 px-4 py-4 sm:px-5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-sm font-semibold text-foreground">{children}</div>
    </div>
  );
}

function isInTheMoney(option: Option, underlyingPrice?: number): boolean | null {
  if (underlyingPrice === undefined) return null;
  return option.optionType === "CALL"
    ? underlyingPrice > option.strikePrice
    : underlyingPrice < option.strikePrice;
}

export function OptionContractInfoGrid({ option, underlyingPrice }: Props) {
  const itm = isInTheMoney(option, underlyingPrice);
  const intrinsicValue =
    underlyingPrice !== undefined
      ? option.optionType === "CALL"
        ? Math.max(0, underlyingPrice - option.strikePrice)
        : Math.max(0, option.strikePrice - underlyingPrice)
      : null;

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid grid-cols-2 divide-border sm:grid-cols-3 [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-border sm:[&>*]:border-b-0 sm:[&>*:not(:nth-child(3n))]:border-r">
        <StatCell label="Strike Price">${option.strikePrice.toFixed(2)}</StatCell>

        <StatCell label="Current Premium">${option.premium.toFixed(2)}</StatCell>

        <StatCell label="Underlying">
          <Link
            to={`/stock/${option.underlyingTicker}`}
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            {option.underlyingTicker}
            <ExternalLink className="size-3" />
          </Link>
        </StatCell>

        <StatCell label="Expiry">
          {new Date(option.expiryTime).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </StatCell>

        {underlyingPrice !== undefined && (
          <StatCell label="Underlying Price">${underlyingPrice.toFixed(2)}</StatCell>
        )}

        {itm !== null && (
          <StatCell label="Moneyness">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                itm
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {itm ? "In the Money" : "Out of Money"}
            </span>
          </StatCell>
        )}

        {intrinsicValue !== null && (
          <StatCell label="Intrinsic Value">${intrinsicValue.toFixed(2)}</StatCell>
        )}
      </div>
    </div>
  );
}
