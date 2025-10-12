import { Navigate } from "react-router-dom";

function PrivateRoute({ children, role, user }) {
  // If not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a role is required and user doesn't match → go to login
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
