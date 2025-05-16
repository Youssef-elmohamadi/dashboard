import React from "react";
import AuthLayout from "./AuthPageLayout";
import ResetPassword from "../../../components/SuperAdmin/Auth/ForgotPassword";
const SuperAdminForgotPassword = () => {
  return (
    <div>
      <AuthLayout>
        <ResetPassword />
      </AuthLayout>
    </div>
  );
};

export default SuperAdminForgotPassword;
