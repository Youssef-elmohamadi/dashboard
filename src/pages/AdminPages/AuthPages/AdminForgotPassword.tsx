import { useEffect } from "react";
import AuthLayout from "../../../components/common/Auth/AuthPageLayout";
import ResetPasswordSteps from "../../../components/common/Auth/ResetPassword";
import PageMeta from "../../../components/common/SEO/PageMeta";

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
