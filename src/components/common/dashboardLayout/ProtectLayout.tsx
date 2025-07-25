import React from "react";
import { Navigate } from "react-router";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const aToken = localStorage.getItem("admin_token");

  if (!aToken) {
    return <Navigate to="/admin/signin" replace />;
  } else {
    return <>{children}</>;  
  }
};

export default ProtectedAdminRoute;
