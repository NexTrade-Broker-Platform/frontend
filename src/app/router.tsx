import { Navigate, Route, Routes } from "react-router";
import { LoginPage } from "@/features/auth/views/LoginPage";
import { OpenAccountPage } from "@/features/auth/views/OpenAccountPage";
import { AdminLoginPage } from "@/features/admin/views/AdminLoginPage";
import { AdminDashboardPage } from "@/features/admin/views/AdminDashboardPage";
import { UserListPage } from "@/features/admin/views/UserListPage";
import { UserDetailPage } from "@/features/admin/views/UserDetailPage";
import { PlatformOrdersPage } from "@/features/admin/views/PlatformOrdersPage";
import { AdminLayout } from "@/features/admin/views/components/AdminLayout";
import { AdminProtectedRoute } from "@/features/admin/views/components/AdminProtectedRoute";
import { DashboardPage } from "@/features/dashboard/views/DashboardPage";
import { MarketsPage } from "@/features/markets/views/MarketsPage";
import { StockDetailPage } from "@/features/markets/views/StockDetailPage";
import { OptionContractDetailPage } from "@/features/markets/views/OptionContractDetailPage";
import { NewsPage } from "@/features/news/views/NewsPage";
import { BotTradingPage } from "@/features/bot-trading/views/BotTradingPage";
import { OrdersPage } from "@/features/orders/views/OrdersPage";
import { OrderDetailPage } from "@/features/orders/views/OrderDetailPage";
import { PortfolioPage } from "@/features/portfolio/views/PortfolioPage";
import { WalletPage } from "@/features/wallet/views/WalletPage";
import { AppLayout } from "@/app/layouts/AppLayout";
import { LandingPage } from "@/features/landing/views/LandingPage";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<OpenAccountPage />} />
      <Route path="/auth" element={<Navigate to="/login" replace />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/markets" element={<MarketsPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/bot-trading" element={<BotTradingPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailPage />} />
        <Route path="/stock/:ticker" element={<StockDetailPage />} />
        <Route path="/options/:optionId" element={<OptionContractDetailPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<UserListPage />} />
        <Route path="/admin/users/:userId" element={<UserDetailPage />} />
        <Route path="/admin/orders" element={<PlatformOrdersPage />} />
        <Route path="/admin/users/:userId/orders" element={<PlatformOrdersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
