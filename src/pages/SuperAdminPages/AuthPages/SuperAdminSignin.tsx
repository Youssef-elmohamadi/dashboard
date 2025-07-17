// import PageMeta from "../../../components/common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
import SEO from "../../../components/common/SEO/seo"; // تم التأكد من استيراد SEO
import AuthLayout from "../../../components/common/Auth/AuthPageLayout";
import SignInForm from "../../../components/common/Auth/SignInForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SuperAdminSignIn() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("super_admin_token");
    if (token) {
      navigate("/super_admin");
    }
  }, []);
  return (
    <>
      <SEO // تم استبدال PageMeta بـ SEO وتحديد البيانات مباشرة
        title={{
          ar: "تشطيبة - تسجيل دخول المشرف العام",
          en: "Tashtiba - Super Admin Sign In",
        }}
        description={{
          ar: "صفحة تسجيل الدخول للمشرف العام في نظام تشطيبة. قم بالوصول إلى لوحة تحكم المشرف العام.",
          en: "Super Admin sign-in page for Tashtiba system. Access the super admin dashboard.",
        }}
        keywords={{
          ar: [
            "تسجيل دخول المشرف العام",
            "مدير تشطيبة",
            "لوحة تحكم المشرف",
            "تسجيل الدخول",
            "إدارة الموقع",
            "تشطيبة",
          ],
          en: [
            "super admin login",
            "Tashtiba admin",
            "super admin dashboard",
            "sign in",
            "website management",
            "Tashtiba",
          ],
        }}
      />
      <AuthLayout userType="super_admin">
        <SignInForm userType="super_admin" />
      </AuthLayout>
    </>
  );
}
