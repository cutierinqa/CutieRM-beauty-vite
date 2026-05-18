import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 1. если нет токена — на логин
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. если роль не совпадает — на главную
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // 3. доступ разрешён
  return children;
}