import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  role?: string;
};

export function ProtectedRoute({ children, role }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
}
