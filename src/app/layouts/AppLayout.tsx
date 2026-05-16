import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  Briefcase,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Newspaper,
  Sun,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { authManager } from "@/features/auth/services/authManager";
import { useTheme } from "@/shared/providers/ThemeProvider";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { APP_NAME } from "@/app/config";
import logo from "@/assets/logo.svg";

export function AppLayout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navGroups = [
    [
      { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/news", label: "News", icon: Newspaper },
      { path: "/markets", label: "Market", icon: TrendingUp },
    ],
    [
      { path: "/portfolio", label: "Portfolio", icon: Briefcase },
      { path: "/wallet", label: "Wallet", icon: Wallet },
      { path: "/orders", label: "Orders", icon: ClipboardList },
    ],
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    authManager.logout().finally(() => {
      queryClient.clear();
      navigate("/login", { replace: true });
    });
  };

  return (
    <div className="flex h-screen bg-background">
      {!isMobileMenuOpen && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
          className="fixed left-4 top-4 z-50 flex size-11 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-lg shadow-black/10 transition-all hover:bg-accent hover:text-accent-foreground active:scale-95 lg:hidden"
        >
          <Menu className="size-5" />
        </button>
      )}

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-card transition-transform lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 animate-hero-in items-center gap-3 border-b border-border px-6">
            <img src={logo} alt={APP_NAME} className="size-7 shrink-0" />
            <span className="flex-1 bg-linear-to-r from-primary to-chart-2 bg-clip-text text-sm font-semibold tracking-wide text-transparent">
              {APP_NAME}
            </span>
            <button
              onClick={closeMobileMenu}
              aria-label="Close menu"
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
            >
              <X className="size-4" />
            </button>
          </div>

          <nav className="flex-1 p-4">
            {navGroups.map((group, gi) => (
              <div key={gi}>
                {gi > 0 && <hr className="my-3 border-border" />}
                <div className="space-y-1">
                  {group.map((item, i) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    const delay = (navGroups.slice(0, gi).flat().length + i + 1) * 75;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={`flex animate-hero-in items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                        style={{ animationDelay: `${delay}ms` }}
                      >
                        <Icon className="size-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="space-y-2 border-t border-border p-4">
            <button
              onClick={toggleTheme}
              className="flex w-full animate-hero-in items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              style={{ animationDelay: `${(navGroups.flat().length + 1) * 75}ms` }}
            >
              {theme === "light" ? <Moon className="size-5" /> : <Sun className="size-5" />}
              <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full animate-hero-in items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              style={{ animationDelay: `${(navGroups.flat().length + 2) * 75}ms` }}
            >
              <LogOut className="size-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
