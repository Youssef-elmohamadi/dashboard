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
      navigate(`/${lang}`, { replace: true });
    }
  }, [navigate, lang]); // Added lang to dependency array

  return (
    <>
      <SEO
        title={{
          ar: `إنشاء حساب جديد على تشطيبة | تسوق مواد التشطيب في مصر`,
          en: `Create Your Account on Tashtiba | Shop Finishing Materials in Egypt`,
        }}
        description={{
          ar: `انضم إلى آلاف المستخدمين وسجّل في تشطيبة لتستمتع بتجربة تسوق فريدة من نوعها تشمل السيراميك، السباكة، الدهانات وغيرها من مواد التشطيب في مصر.`,
          en: `Join thousands of users and register on Tashtiba to enjoy a unique shopping experience for ceramic, plumbing, paints, and other finishing materials in Egypt.`,
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
            "مواد تشطيب",
            "مصر",
            "تشطيب",
          ],
          en: [
            "tashtiba",
            "sign up",
            "register account",
            "create account",
            "new user",
            "join now",
            "online shopping",
            "finishing materials",
            "Egypt",
            "construction supplies",
          ],
        }}
        url={`https://tashtiba.com/${lang}/signup`}
        image="https://tashtiba.com/og-image.png"
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/signup" },
          { lang: "en", href: "https://tashtiba.com/en/signup" },
          { lang: "x-default", href: "https://tashtiba.com/ar/signup" },
        ]}
        structuredData={{
          "@type": "WebPage",
          url: `https://tashtiba.com/${lang}/signup`,
          inLanguage: lang,
        }}
        lang={lang as "ar" | "en"}
      />

      <AuthLayout>
        <EndUserSignUpForm />
      </AuthLayout>
    </>
  );
}
