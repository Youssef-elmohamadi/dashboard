// import PageMeta from "../../../components/common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
import SEO from "../../../components/common/SEO/seo"; // تم التأكد من استيراد SEO
import AuthLayout from "../../../components/common/Auth/AuthPageLayout";
import SignUpForm from "../../../components/admin/auth/SignUpForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function AdminSignUp() {
  const { t } = useTranslation(["auth"]);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      navigate("/admin");
    }
  }, []);
  return (
    <>
      <SEO // تم استبدال PageMeta بـ SEO وتحديد البيانات مباشرة
        title={{
          ar: "تشطيبة - تسجيل أدمن جديد",
          en: "Tashtiba - Admin Sign Up",
        }}
        description={{
          ar: "سجل كأدمن جديد لمتجر تشطيبة. أنشئ حسابًا لإدارة متجرك والوصول إلى لوحة التحكم.",
          en: "Register as a new admin for Tashtiba store. Create an account to manage your store and access the dashboard.",
        }}
        keywords={{
          ar: [
            "تسجيل أدمن جديد",
            "إنشاء حساب أدمن",
            "أدمن تشطيبة",
            "إدارة المتجر",
            "تسجيل",
            "حساب جديد",
          ],
          en: [
            "admin sign up",
            "create admin account",
            "Tashtiba admin",
            "store management",
            "register",
            "new account",
          ],
        }}
      />
      <AuthLayout userType="admin">
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
