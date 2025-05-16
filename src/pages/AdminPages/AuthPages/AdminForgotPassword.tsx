import React from "react";
import AuthLayout from "./AuthPageLayout";
import ResetPasswordSteps from "../../../components/admin/auth/ForgotPassword";

const AdminForgotPassword = () => {
  return (
    <div>
      <AuthLayout>
        <ResetPasswordSteps />
      </AuthLayout>
    </div>
  );
};

export default AdminForgotPassword;
