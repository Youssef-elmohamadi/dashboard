import AuthLayout from "../../../components/common/Auth/AuthPageLayout";
import EndUserSignUpForm from "../../../components/EndUser/Auth/EndUserSignUpForm";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import SEO from "../../../components/common/SEO/seo"; // Import your custom SEO component

export default function EndUserSignUp() {
  const navigate = useNavigate();
  const { lang } = useDirectionAndLanguage(); // Assuming this context provides 'lang'

  useEffect(() => {
    // Redirect authenticated users away from the sign-up page
    const token = localStorage.getItem("end_user_token");
    if (token) {
      navigate(`/${lang}/`, { replace: true });
    }
  }, [navigate, lang]); // Added lang to dependency array

  return (
    <>
      <SEO
        title={{
          ar: `تشطيبة - إنشاء حساب جديد`,
          en: `Tashtiba - Create New Account`,
        }}
        description={{
          ar: `سجل الآن في تشطيبة واستمتع بتجربة تسوق فريدة. أنشئ حسابًا جديدًا للوصول إلى آلاف المنتجات والعروض الحصرية في مصر.`,
          en: `Register now on Tashtiba and enjoy a unique shopping experience. Create a new account to access thousands of products and exclusive offers in Egypt.`,
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "تسجيل حساب",
            "إنشاء حساب",
            "حساب جديد",
            "سجل الآن",
            "مستخدم جديد",
            "التسوق أونلاين",
            "مصر",
            "التسجيل",
          ],
          en: [
            "tashtiba",
            "sign up",
            "register account",
            "create account",
            "new user",
            "join now",
            "online shopping",
            "Egypt",
            "registration",
          ],
        }}
        alternates={[
          // Assuming your sign-up page URL structure is like /ar/signup
          { lang: "ar", href: "https://tashtiba.vercel.app/ar/signup" },
          { lang: "en", href: "https://tashtiba.vercel.app/en/signup" },
          { lang: "x-default", href: "https://tashtiba.vercel.app/en/signup" }, // Default to English
        ]}
      />
      <AuthLayout>
        <EndUserSignUpForm />
      </AuthLayout>
    </>
  );
}
