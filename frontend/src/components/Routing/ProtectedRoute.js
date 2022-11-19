import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ redirectPath = "/" }) => {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
