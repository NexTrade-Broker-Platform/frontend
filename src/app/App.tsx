import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { AppRouter } from "./router";
import { ThemeProvider } from "../shared/providers/ThemeProvider";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { NotificationProvider } from "@/providers/NotificationProvider";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <NotificationProvider>
            <AppRouter />
            <Toaster richColors position="top-right" />
          </NotificationProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
}
