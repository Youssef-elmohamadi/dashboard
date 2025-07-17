import { useEffect } from "react";
import AuthLayout from "../../../components/common/Auth/AuthPageLayout";
import ResetPassword from "../../../components/common/Auth/ResetPassword";
import { useNavigate } from "react-router-dom";
import SEO from "../../../components/common/SEO/seo"; // تم استيراد SEO component

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
      <SEO // تم إضافة SEO component وتحديد البيانات مباشرة
        title={{
          ar: "تشطيبة - استعادة كلمة مرور المشرف العام",
          en: "Tashtiba - Super Admin Forgot Password",
        }}
        description={{
          ar: "صفحة استعادة كلمة المرور للمشرف العام في نظام تشطيبة. قم بإعادة تعيين كلمة مرور حساب المشرف العام.",
          en: "Super Admin forgot password page for Tashtiba system. Reset your super admin account password.",
        }}
        keywords={{
          ar: [
            "استعادة كلمة مرور",
            "نسيت كلمة المرور",
            "مشرف عام",
            "تشطيبة",
            "إعادة تعيين كلمة المرور",
            "تسجيل الدخول",
          ],
          en: [
            "forgot password",
            "reset password",
            "super admin",
            "Tashtiba",
            "password recovery",
            "login help",
          ],
        }}
      />
      <AuthLayout userType="super_admin">
        <ResetPassword type="super_admin" />
      </AuthLayout>
    </div>
  );
};

export default SuperAdminForgotPassword;
