// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Se o usuário não estiver autenticado, redireciona para a página de login
    return <Navigate to="/login" />;
  }

  // Caso o usuário esteja autenticado, renderiza o componente filho
  return children;
};

export default ProtectedRoute;
