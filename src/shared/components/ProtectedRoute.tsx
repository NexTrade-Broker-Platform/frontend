import type { ReactNode } from 'react'
import { Navigate } from "react-router";
import { isAuthenticated } from "../lib/auth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
