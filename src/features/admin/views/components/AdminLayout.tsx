import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, LogOut, ShieldCheck, Users, History } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { authManager } from "@/features/auth/services/authManager";
import { clearAdminAuthenticated } from "@/shared/lib/adminAuth";
import { APP_NAME } from "@/app/config";

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  function handleLogout() {
    authManager.logout().finally(() => {
      clearAdminAuthenticated();
      queryClient.clear();
      navigate("/admin", { replace: true });
    });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
          <ShieldCheck className="size-6 text-destructive" />
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-destructive">Admin Portal</p>
            <p className="text-[10px] font-medium text-muted-foreground uppercase">{APP_NAME}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive("/admin/dashboard") 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive("/admin/users") 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <Users className="size-4" />
            Users
          </Link>

          <Link
            to="/admin/orders"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive("/admin/orders") 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <History className="size-4" />
            Orders
          </Link>
        </nav>

        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background/50">
        <Outlet />
      </main>
    </div>
  );
}
