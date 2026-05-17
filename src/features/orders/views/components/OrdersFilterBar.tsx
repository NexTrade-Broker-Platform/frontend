export type FilterTab =
  | "ALL"
  | "PENDING"
  | "PARTIALLY_FILLED"
  | "FILLED"
  | "CANCELLED";

export const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "PENDING", label: "In Progress" },
  { id: "PARTIALLY_FILLED", label: "Partially Filled" },
  { id: "FILLED", label: "Filled" },
  { id: "CANCELLED", label: "Cancelled" },
];

type Props = {
  active: FilterTab;
  onChange: (tab: FilterTab) => void;
};

export function OrdersFilterBar({ active, onChange }: Props) {
  return (
    <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
