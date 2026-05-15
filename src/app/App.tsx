import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { AppRouter } from "./router";
import { ThemeProvider } from "../shared/providers/ThemeProvider";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <AppRouter />
          <Toaster richColors position="top-right" />
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
}
