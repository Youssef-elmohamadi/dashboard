import { useEffect } from "react";
import AuthLayout from "../../../components/common/Auth/AuthPageLayout";
import ResetPasswordSteps from "../../../components/common/Auth/ResetPassword";
import SEO from "../../../components/common/SEO/seo"; // تم التأكد من استيراد SEO

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
      <SEO
        title={{
          ar: "استعادة كلمة مرور الأدمن",
          en: "Admin Forgot Password",
        }}
        description={{
          ar: "صفحة استعادة كلمة المرور لحساب الأدمن في نظام تشطيبة. قم بإعادة تعيين كلمة مرور حسابك.",
          en: "Admin forgot password page for Tashtiba system. Reset your admin account password.",
        }}
        keywords={{
          ar: [
            "استعادة كلمة مرور الأدمن",
            "نسيت كلمة المرور",
            "أدمن تشطيبة",
            "إعادة تعيين كلمة المرور",
            "تسجيل الدخول",
          ],
          en: [
            "admin forgot password",
            "reset admin password",
            "Tashtiba admin",
            "password recovery",
            "admin login help",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <AuthLayout userType="admin">
        <ResetPasswordSteps type="admin" />
      </AuthLayout>
    </div>
  );
};

export default AdminForgotPassword;
