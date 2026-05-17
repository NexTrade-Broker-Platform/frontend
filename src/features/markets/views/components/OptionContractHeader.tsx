import { AlertTriangle, Clock } from "lucide-react";
import type { Option } from "@/features/markets/types/markets";

type Props = {
  option: Option;
};

function getExpiryStatus(expiryTime: string): { label: string; urgent: boolean } {
  const ms = new Date(expiryTime).getTime() - Date.now();
  const hours = ms / (1000 * 60 * 60);
  if (hours < 0) return { label: "Expired", urgent: false };
  if (hours < 24) return { label: `Expires in ${Math.floor(hours)}h`, urgent: true };
  const days = Math.floor(hours / 24);
  return { label: `Expires in ${days}d`, urgent: days <= 3 };
}

export function OptionContractHeader({ option }: Props) {
  const expiry = getExpiryStatus(option.expiryTime);

  return (
    <div className="mb-6">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
            option.optionType === "CALL"
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {option.optionType}
        </span>
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
          {option.underlyingTicker}
        </span>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            option.isActive
              ? "bg-success/10 text-success"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {option.isActive ? "Active" : "Expired"}
        </span>
      </div>

      <h1 className="mb-1 text-2xl font-bold text-foreground sm:text-3xl">
        {option.underlyingTicker} ${option.strikePrice.toFixed(2)}{" "}
        {option.optionType}
      </h1>
      <p className="text-sm text-muted-foreground">Option Contract · {option.optionId}</p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm ${
            expiry.urgent
              ? "bg-warning/10 text-warning"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {expiry.urgent ? (
            <AlertTriangle className="size-3.5" />
          ) : (
            <Clock className="size-3.5" />
          )}
          {expiry.label}
        </span>

        {option.isActive && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/5 px-3 py-1.5 text-sm text-primary">
            Auto-exercises at expiry if profitable
          </span>
        )}
      </div>
    </div>
  );
}
