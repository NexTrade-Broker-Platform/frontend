import { Outlet, Link, useNavigate } from "react-router";
import { LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { authManager } from "@/features/auth/services/authManager";
import { clearAdminAuthenticated } from "@/shared/lib/adminAuth";
import { APP_NAME } from "@/app/config";

export function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleLogout() {
    authManager.logout().finally(() => {
      clearAdminAuthenticated();
      queryClient.clear();
      navigate("/admin", { replace: true });
    });
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <ShieldCheck className="size-5 text-destructive" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-destructive">Admin</p>
            <p className="text-xs text-muted-foreground">{APP_NAME}</p>
          </div>
        </div>

        <nav className="flex-1 p-3">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
        </nav>

        <div className="border-t border-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
