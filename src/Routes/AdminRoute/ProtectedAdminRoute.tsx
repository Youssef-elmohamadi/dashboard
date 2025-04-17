import React from "react";
import { Navigate } from "react-router";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const aToken = localStorage.getItem("aToken");

  if (!aToken) {
    return <Navigate to="/admin/signin" replace />;
  } else {
    return <>{children}</>; // هنا هنرجع children زي ما هو
  }
};

export default ProtectedAdminRoute;
