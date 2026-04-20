import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  Briefcase,
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
import { clearAuthenticated } from "../../../shared/lib/auth";
import { useTheme } from "../../../shared/providers/ThemeProvider";

export function DashboardLayout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/markets", label: "Markets", icon: TrendingUp },
    { path: "/portfolio", label: "Portfolio", icon: Briefcase },
    { path: "/wallet", label: "Wallet", icon: Wallet },
    { path: "/news", label: "News", icon: Newspaper },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    clearAuthenticated();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="flex h-screen bg-background">
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed left-4 top-4 z-50 flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground lg:hidden"
      >
        {isMobileMenuOpen ? (
          <X className="size-5" />
        ) : (
          <Menu className="size-5" />
        )}
      </button>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-card transition-transform lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-border px-6">
            <h1 className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              TradeFlow
            </h1>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="size-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="space-y-2 border-t border-border p-4">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {theme === "light" ? (
                <Moon className="size-5" />
              ) : (
                <Sun className="size-5" />
              )}
              <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="size-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto lg:ml-0">
        <Outlet />
      </main>
    </div>
  );
}
