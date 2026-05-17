import { useState } from "react";
import { AlertTriangle, ArrowLeft, ShieldAlert } from "lucide-react";
import { FadeIn } from "@/shared/components/FadeIn";

const risks = [
  "Bot trading does not guarantee profit. You may lose part or all of your invested capital.",
  "Past performance of automated strategies is not indicative of future results.",
  "Market conditions can change rapidly and the bot may not react appropriately in all scenarios.",
  "You remain solely responsible for all trades executed on your account.",
  "NexTrade does not provide financial advice. This feature is a tool, not a recommendation.",
];

type Props = {
  onAccept: () => void;
  onBack: () => void;
};

export function BotRiskConfirmation({ onAccept, onBack }: Props) {
  const [checked, setChecked] = useState(false);

  return (
    <FadeIn>
      <div className="mx-auto max-w-xl">
        {/* Back */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        {/* Warning header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10">
            <ShieldAlert className="size-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Risk Disclosure</h2>
            <p className="text-sm text-muted-foreground">Please read carefully before continuing</p>
          </div>
        </div>

        {/* Risk list */}
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
          <ul className="space-y-3">
            {risks.map((risk, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                <span className="text-foreground/80">{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Checkbox */}
        <label className="mb-6 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 size-4 accent-primary"
          />
          <span className="text-sm text-muted-foreground">
            I understand and accept the risks involved in automated bot trading and confirm that I am making this decision independently.
          </span>
        </label>

        {/* CTA */}
        <button
          onClick={onAccept}
          disabled={!checked}
          className="w-full rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Activate Bot Trading
        </button>
      </div>
    </FadeIn>
  );
}
