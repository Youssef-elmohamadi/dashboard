import React from "react";
import { Navigate } from "react-router";
const ProtectLayout = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/signin" replace />;
  } else {
    return children;
  }
};

export default ProtectLayout;
