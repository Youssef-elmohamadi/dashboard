import { useEffect } from "react";
import AuthLayout from "../../../components/common/Auth/AuthPageLayout";
import ResetPassword from "../../../components/common/Auth/ResetPassword";
import { useNavigate } from "react-router-dom";
const SuperAdminForgotPassword = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("super_admin_token");
    if (token) {
      navigate("/super_admin");
    }
  }, []);
  return (
    <div>
      <AuthLayout userType="super_admin">
        <ResetPassword type="super_admin" />
      </AuthLayout>
    </div>
  );
};

export default SuperAdminForgotPassword;
