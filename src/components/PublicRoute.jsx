import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isAuthenticated && location.pathname.startsWith("/join/")) {
    return children;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};
