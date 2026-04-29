import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router";

type ProtectedRouteProps = {
  children: ReactNode;
};

type AuthState = "loading" | "authenticated" | "unauthenticated";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authState, setAuthState] = useState<AuthState>("loading");

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
          method: "GET",
          credentials: "include",
        });

        if (cancelled) return;

        setAuthState(response.ok ? "authenticated" : "unauthenticated");
      } catch {
        if (cancelled) return;
        setAuthState("unauthenticated");
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  if (authState === "loading") {
    return null;
  }

  if (authState === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
