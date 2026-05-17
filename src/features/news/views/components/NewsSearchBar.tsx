import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function NewsSearchBar({ value, onChange }: Props) {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search events…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-input-background py-3 pl-10 pr-4 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
