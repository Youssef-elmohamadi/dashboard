import SEO from "../../../components/common/SEO/seo"; 
import AuthLayout from "../../../components/common/Auth/AuthPageLayout";
import SignInForm from "../../../components/common/Auth/SignInForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function AdminSignIn() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      navigate("/admin");
    }
  }, []);
  return (
    <>
      <SEO
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
        robotsTag="noindex, nofollow"
      />
      <AuthLayout userType="admin">
        <SignInForm userType="admin" />
      </AuthLayout>
    </>
  );
}
