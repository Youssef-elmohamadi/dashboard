import { useEffect } from "react";
import AuthLayout from "../../../components/common/AuthPageLayout";
import ResetPasswordSteps from "../../../components/common/ResetPassword";
import PageMeta from "../../../components/common/PageMeta";

import { useNavigate } from "react-router-dom";
const AdminForgotPassword = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      navigate("/admin");
    }
  }, []);
  return (
    <div>
      <PageMeta
        title="Tashtiba |Admin Forgot Password"
        description="Verify and reset Your Password"
      />
      <AuthLayout userType="admin">
        <ResetPasswordSteps type="admin" />
      </AuthLayout>
    </div>
  );
};

export default AdminForgotPassword;
