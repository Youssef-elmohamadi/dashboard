import React from "react";
import { Navigate } from "react-router";
import { AdminProvider } from "../../components/admin/context/AdminContext";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const aToken = localStorage.getItem("admin_token");
  if (!aToken) {
    return <Navigate to="/admin/signin" replace />;
  } else {
    return <AdminProvider>{children}</AdminProvider>;
  }
};

export default ProtectedAdminRoute;
