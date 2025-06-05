import React, { useEffect } from "react";
import AuthLayout from "./AuthPageLayout";
import ResetPassword from "../../../components/common/ResetPassword";
import { useNavigate } from "react-router-dom";
const SuperAdminForgotPassword = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("sToken");
    if (token) {
      navigate("/super_admin");
    }
  }, []);
  return (
    <div>
      <AuthLayout>
        <ResetPassword type="super_admin" />
      </AuthLayout>
    </div>
  );
};

export default SuperAdminForgotPassword;
