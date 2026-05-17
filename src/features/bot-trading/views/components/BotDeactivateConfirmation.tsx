import { ArrowLeft, PowerOff } from "lucide-react";
import { FadeIn } from "@/shared/components/FadeIn";

type Props = {
  onConfirm: () => void;
  onBack: () => void;
};

export function BotDeactivateConfirmation({ onConfirm, onBack }: Props) {
  return (
    <FadeIn>
      <div className="mx-auto max-w-md">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10">
            <PowerOff className="size-6 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Deactivate Bot Trading?</h2>
            <p className="text-sm text-muted-foreground">This will stop all automated activity</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-foreground/80 space-y-2">
          <p>Any open positions managed by the bot will <span className="font-semibold text-foreground">not</span> be automatically closed — you will need to manage them manually.</p>
          <p>Your activity history and statistics will be cleared. You can reactivate bot trading at any time.</p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <button
            onClick={onBack}
            className="flex-1 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-destructive px-6 py-3 text-sm font-semibold text-destructive-foreground shadow-lg shadow-destructive/20 transition-all hover:bg-destructive/90 active:scale-95"
          >
            Yes, Deactivate
          </button>
        </div>
      </div>
    </FadeIn>
  );
}
