import React, { useEffect } from "react";
import AuthLayout from "./AuthPageLayout";
import ResetPassword from "../../../components/common/ResetPassword";

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
        <ResetPassword type="user" />
      </AuthLayout>
    </div>
  );
};

export default UserForgotPassword;
