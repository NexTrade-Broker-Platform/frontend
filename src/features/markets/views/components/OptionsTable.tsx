import type { Option } from "@/features/markets/types/markets";

type OptionsTableProps = {
  options: Option[];
  isLoading: boolean;
};

export function OptionsTable({ options, isLoading }: OptionsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-muted-foreground">Underlying</th>
              <th className="px-6 py-4 text-left text-sm text-muted-foreground">Type</th>
              <th className="px-6 py-4 text-right text-sm text-muted-foreground">Strike</th>
              <th className="px-6 py-4 text-right text-sm text-muted-foreground">Premium</th>
              <th className="px-6 py-4 text-left text-sm text-muted-foreground">Expires</th>
              <th className="px-6 py-4 text-left text-sm text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading &&
              options.map((option) => (
                <tr
                  key={option.optionId}
                  className="border-b border-border transition-colors last:border-0 hover:bg-accent"
                >
                  <td className="px-6 py-4 font-medium text-foreground">{option.underlyingTicker}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        option.optionType === "CALL"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {option.optionType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-foreground">
                    ${option.strikePrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-foreground">
                    ${option.premium.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(option.expiryTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        option.isActive
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {option.isActive ? "Active" : "Expired"}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
