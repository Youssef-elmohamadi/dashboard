import React, { useEffect } from "react";
import AuthLayout from "./AuthPageLayout";
import ResetPassword from "../../../components/EndUser/Auth/ForgotPassword";

import { useNavigate } from "react-router-dom";
const UserForgotPassword = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("uToken");
    if (token) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <AuthLayout>
        <ResetPassword />
      </AuthLayout>
    </div>
  );
};

export default UserForgotPassword;
