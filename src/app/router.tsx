import { Navigate, Route, Routes } from "react-router";
import { LoginPage } from "@/features/auth/views/LoginPage";
import { OpenAccountPage } from "@/features/auth/views/OpenAccountPage";
import { DashboardPage } from "@/features/dashboard/views/DashboardPage";
import { MarketsPage } from "@/features/markets/views/MarketsPage";
import { StockDetailPage } from "@/features/markets/views/StockDetailPage";
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
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
