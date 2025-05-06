import React from "react";
import { Navigate } from "react-router";
import { AdminProvider } from "../../context/AdminContext";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const aToken = localStorage.getItem("aToken");
    return <AdminProvider>{children}</AdminProvider>;
};

export default ProtectedAdminRoute;