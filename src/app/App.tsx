import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { AppRouter } from "./router";
import { ThemeProvider } from "../shared/providers/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRouter />
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </ThemeProvider>
  );
}
