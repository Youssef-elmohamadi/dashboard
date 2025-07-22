import AuthLayout from "../../../components/common/Auth/AuthPageLayout";
import SignInForm from "../../../components/common/Auth/SignInForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import SEO from "../../../components/common/SEO/seo"; // Import your custom SEO component

export default function EndUserSignIn() {
  const navigate = useNavigate();
  const { lang } = useDirectionAndLanguage(); // Assuming this context provides 'lang'

  useEffect(() => {
    // Redirect authenticated users away from the sign-in page
    const token = localStorage.getItem("end_user_token");
    if (token) {
      navigate(`/${lang}/`, { replace: true });
    }
  }, [navigate, lang]); // Added lang to dependency array

  return (
    <>
      <SEO
        title={{
          ar: `تشطيبة - تسجيل الدخول`,
          en: `Tashtiba - Login`,
        }}
        description={{
          ar: `سجل الدخول إلى حسابك في تشطيبة للوصول إلى المنتجات المفضلة لديك، تتبع الطلبات، وإدارة ملفك الشخصي في مصر.`,
          en: `Log in to your Tashtiba account to access your favorite products, track orders, and manage your profile in Egypt.`,
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "تسجيل الدخول",
            "دخول المستخدم",
            "حسابي",
            "لوحة تحكم المستخدم",
            "بوابة المستخدم",
            "مصر",
            "التسوق أونلاين",
          ],
          en: [
            "tashtiba",
            "login",
            "sign in",
            "user account",
            "customer login",
            "my account",
            "Egypt",
            "online shopping",
          ],
        }}
        alternates={[
          // Assuming your sign-in page URL structure is like /ar/signin
          { lang: "ar", href: "https://tashtiba.com/ar/signin" },
          { lang: "en", href: "https://tashtiba.com/en/signin" },
          { lang: "x-default", href: "https://tashtiba.com/en/signin" }, // Default to English
        ]}
      />
      <AuthLayout userType="end_user">
        <SignInForm userType="end_user" />
      </AuthLayout>
    </>
  );
}
