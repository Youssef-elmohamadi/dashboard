import AuthLayout from "../../../components/common/Auth/AuthPageLayout";
import EndUserSignUpForm from "../../../components/EndUser/Auth/EndUserSignUpForm";

import { useNavigate } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import SEO from "../../../components/common/SEO/seo"; 
import LoadingPageEndUser from "../../../components/ui/LoadingPageEndUser";

export default function EndUserSignUp() {
  const navigate = useNavigate();
  const { lang } = useDirectionAndLanguage(); 

  useEffect(() => {
    const token = localStorage.getItem("end_user_token");
    if (token) {
      navigate(`/${lang}`, { replace: true });
    }
  }, [navigate, lang]); 
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
          "@context": "https://schema.org",
          "@type": "WebPage",
          url: `https://tashtiba.com/${lang}/signup`,
          inLanguage: lang,
          name:
            lang === "ar"
              ? "إنشاء حساب جديد على تشطيبة"
              : "Create Account on Tashtiba",
          description:
            lang === "ar"
              ? "سجل الآن على تشطيبة لتجربة تسوق مواد التشطيب في مصر"
              : "Register now on Tashtiba to shop finishing materials in Egypt",
          isPartOf: {
            "@type": "WebSite",
            name: lang === "ar" ? "تشطيبة" : "Tashtiba",
            url: "https://tashtiba.com",
          },
        }}
        pageType="register"
        lang={lang as "ar" | "en"}
      />

        <Suspense fallback={<LoadingPageEndUser />}>
        <AuthLayout>
          <EndUserSignUpForm />
        </AuthLayout>
      </Suspense>
    </>
  );
}
