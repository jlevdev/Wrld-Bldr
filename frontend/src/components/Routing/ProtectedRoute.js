import React, { useContext } from "react";
import AuthContext from "context/AuthContext";

import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to={redirectPath} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
