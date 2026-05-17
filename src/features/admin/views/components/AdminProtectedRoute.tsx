import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router";
import { Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

type State = "loading" | "authorized" | "unauthorized";

export function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          method: "GET",
          credentials: "include",
        });

        if (cancelled) return;

        if (!res.ok) { setState("unauthorized"); return; }

        const data = await res.json();
        const isAdmin = data?.isAdmin ?? data?.is_admin ?? data?.user?.isAdmin ?? data?.user?.is_admin ?? false;
        setState(isAdmin ? "authorized" : "unauthorized");
      } catch {
        if (!cancelled) setState("unauthorized");
      }
    }

    check();
    return () => { cancelled = true; };
  }, []);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (state === "unauthorized") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
