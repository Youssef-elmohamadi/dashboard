import React from "react";
import AuthLayout from "./AuthPageLayout";
import ResetPassword from "../../../components/EndUser/Auth/ForgotPassword";

const UserForgotPassword = () => {
  return (
    <div>
      <AuthLayout>
        <ResetPassword />
      </AuthLayout>
    </div>
  );
};

export default UserForgotPassword;
