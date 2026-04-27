import { Navigate, Route, Routes } from "react-router";
import { LoginPage } from "../features/auth/views/LoginPage";
import { OpenAccountPage } from "../features/auth/views/OpenAccountPage";
import { DashboardLayout } from "../features/dashboard/components/DashboardLayout";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { MarketsPage } from "../features/dashboard/pages/MarketsPage";
import { NewsPage } from "../features/dashboard/pages/NewsPage";
import { PortfolioPage } from "../features/dashboard/pages/PortfolioPage";
import { StockDetailPage } from "../features/dashboard/pages/StockDetailPage";
import { WalletPage } from "../features/dashboard/pages/WalletPage";
import { LandingPage } from "../features/landing/views/LandingPage";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { isAuthenticated } from "../shared/lib/auth";

function AuthGuard({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={
          <AuthGuard>
            <LoginPage />
          </AuthGuard>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthGuard>
            <OpenAccountPage />
          </AuthGuard>
        }
      />
      <Route path="/auth" element={<Navigate to="/login" replace />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/markets" element={<MarketsPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/stock/:symbol" element={<StockDetailPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
