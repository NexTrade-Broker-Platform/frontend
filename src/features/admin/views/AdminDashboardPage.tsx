import { useState } from "react";
import { Bot, DollarSign, Loader2, Percent, Users, AlertCircle, Check, X, ArrowRight, History, Wallet } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { useAdminStats } from "@/features/admin/hooks/useAdminStats";
import { useUpdateFeeRate } from "@/features/admin/hooks/useUpdateFeeRate";
import { FadeIn } from "@/shared/components/FadeIn";

function StatCard({
  label, value, sub, icon: Icon, iconBg, iconColor, isLoading, link,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  isLoading?: boolean;
  link?: { to: string; label: string };
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={`flex size-9 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`size-5 ${iconColor}`} />
        </div>
      </div>
      <div className="flex-1">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>
        ) : (
          <>
            <p className="text-3xl font-bold tabular-nums">{value}</p>
            {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
          </>
        )}
      </div>
      {link && (
        <Link
          to={link.to}
          className="mt-6 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2 text-xs font-semibold transition-colors hover:bg-muted"
        >
          {link.label}
          <ArrowRight className="size-3" />
        </Link>
      )}
    </div>
  );
}

function FeeRateCard({ feeRate, isLoading }: { feeRate: number | undefined; isLoading: boolean }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const { mutate: updateFeeRate, isPending } = useUpdateFeeRate();

  function startEdit() {
    setDraft(feeRate !== undefined ? String(feeRate) : "");
    setEditing(true);
  }

  function handleSave() {
    const value = parseFloat(draft);
    if (Number.isNaN(value) || value < 0 || value > 100) {
      toast.error("Enter a valid fee rate between 0 and 100.");
      return;
    }
    updateFeeRate(value, {
      onSuccess: () => { toast.success("Fee rate updated."); setEditing(false); },
      onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to update."),
    });
  }

  function handleCancel() {
    setEditing(false);
    setDraft("");
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Fee Rate</span>
        <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10">
          <Percent className="size-5 text-amber-400" />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        </div>
      ) : editing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              className="w-28 rounded-xl border border-input bg-input-background px-3 py-2 text-lg font-bold tabular-nums focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <span className="text-lg font-bold text-muted-foreground">%</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
            >
              {isPending ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-3xl font-bold tabular-nums">
            {feeRate !== undefined ? `${feeRate}%` : "—"}
          </p>
          <button
            onClick={startEdit}
            className="mt-2 text-xs text-primary transition-colors hover:underline"
          >
            Change fee rate
          </button>
        </>
      )}
    </div>
  );
}

import { AdminRealtimeChart } from "./components/AdminRealtimeChart";
import { AdminAnalyticsSection } from "./components/AdminAnalyticsSection";

export function AdminDashboardPage() {
  const { data: stats, isLoading, isError, error } = useAdminStats();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <FadeIn>
        <div className="mb-8">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-destructive">
            Admin
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Platform overview and configuration</p>
        </div>
      </FadeIn>

      {isError && (
        <FadeIn>
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertCircle className="size-5 shrink-0" />
            {(error as Error).message}
          </div>
        </FadeIn>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <FadeIn delay={75}>
          <StatCard
            label="Total Revenue"
            value={stats ? `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—"}
            sub="Cumulative platform fees"
            icon={DollarSign}
            iconBg="bg-success/10"
            iconColor="text-success"
            isLoading={isLoading}
          />
        </FadeIn>

        <FadeIn delay={100}>
          <StatCard
            label="Platform Money"
            value={stats ? `$${stats.totalMoney.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—"}
            sub="Total user balances"
            icon={Wallet}
            iconBg="bg-primary/10"
            iconColor="text-primary"
            isLoading={isLoading}
          />
        </FadeIn>

        <FadeIn delay={125}>
          <FeeRateCard feeRate={stats?.feeRate} isLoading={isLoading} />
        </FadeIn>

        <FadeIn delay={175}>
          <StatCard
            label="Total Users"
            value={stats?.totalUsers.toLocaleString() ?? "—"}
            sub="Registered accounts"
            icon={Users}
            iconBg="bg-primary/10"
            iconColor="text-primary"
            isLoading={isLoading}
            link={{ to: "/admin/users", label: "Manage Users" }}
          />
        </FadeIn>

        <FadeIn delay={225}>
          <StatCard
            label="Running Bots"
            value={stats?.totalRunningBots.toLocaleString() ?? "—"}
            sub="Active bot sessions"
            icon={Bot}
            iconBg="bg-violet-500/10"
            iconColor="text-violet-400"
            isLoading={isLoading}
          />
        </FadeIn>

        <FadeIn delay={250}>
          <StatCard
            label="Total Orders"
            value={stats?.totalOrders.toLocaleString() ?? "—"}
            sub="All-time platform orders"
            icon={History}
            iconBg="bg-amber-500/10"
            iconColor="text-amber-500"
            isLoading={isLoading}
            link={{ to: "/admin/orders", label: "View Order History" }}
          />
        </FadeIn>
      </div>

      <div className="space-y-8">
        <FadeIn delay={300}>
          <AdminAnalyticsSection />
        </FadeIn>

        <FadeIn delay={400}>
          <AdminRealtimeChart />
        </FadeIn>
      </div>
    </div>
  );
}
