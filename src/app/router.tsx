import { Navigate, Route, Routes } from "react-router";
import { AuthPage } from "../features/auth/pages/AuthPage";
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

export function AppRouter() {
  const authElement = isAuthenticated() ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <AuthPage />
  );

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={authElement} />
      <Route path="/login" element={authElement} />
      <Route path="/signup" element={authElement} />

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

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
