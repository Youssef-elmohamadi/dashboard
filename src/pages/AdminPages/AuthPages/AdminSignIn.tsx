// import PageMeta from "../../../components/common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
import SEO from "../../../components/common/SEO/seo"; // تم التأكد من استيراد SEO
import AuthLayout from "../../../components/common/Auth/AuthPageLayout";
import SignInForm from "../../../components/common/Auth/SignInForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdminSignIn() {
  const navigate = useNavigate();
  const { t } = useTranslation(["auth"]);
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
          ar: "تشطيبة - تسجيل دخول الأدمن",
          en: "Tashtiba - Admin Sign In",
        }}
        description={{
          ar: "صفحة تسجيل الدخول لحساب الأدمن في نظام تشطيبة. قم بالوصول إلى لوحة تحكم المتجر وإدارته.",
          en: "Admin sign-in page for Tashtiba system. Access the store's dashboard and manage it.",
        }}
        keywords={{
          ar: [
            "تسجيل دخول الأدمن",
            "إدارة المتجر",
            "أدمن تشطيبة",
            "لوحة تحكم",
            "تسجيل الدخول",
            "إدارة التجارة الإلكترونية",
          ],
          en: [
            "admin login",
            "store management",
            "Tashtiba admin",
            "dashboard",
            "sign in",
            "e-commerce administration",
          ],
        }}
      />
      <AuthLayout userType="admin">
        <SignInForm userType="admin" />
      </AuthLayout>
    </>
  );
}
