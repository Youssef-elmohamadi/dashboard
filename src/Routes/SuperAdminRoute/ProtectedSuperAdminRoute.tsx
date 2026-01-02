import React from "react";
import { Navigate } from "react-router";
import { SuperAdminProvider } from "../../components/SuperAdmin/context/SuperAdminContext";
const ProtectedSuperAdminRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const sToken = localStorage.getItem("super_admin_token");
  if (!sToken) {
    return <Navigate to="/super_admin/signin" replace />;
  } else {
    return <SuperAdminProvider>{children}</SuperAdminProvider>;
  }
};

export default ProtectedSuperAdminRoute;
