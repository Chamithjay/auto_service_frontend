import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  const payload = jwtDecode(token);
  const userRole = payload.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const redirectMap = {
      ADMIN: "/admin/dashboard",
      EMPLOYEE: "/employee/dashboard",
      CUSTOMER: "/customer/dashboard",
    };

    return <Navigate to={redirectMap[userRole] || "/home"} replace />;
  }

  return children;
};

export default ProtectedRoute;
