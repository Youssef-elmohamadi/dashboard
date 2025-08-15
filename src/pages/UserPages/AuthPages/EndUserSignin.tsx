import AuthLayout from "../../../components/common/Auth/AuthPageLayout";
import SignInForm from "../../../components/common/Auth/SignInForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import SEO from "../../../components/common/SEO/seo";

export default function EndUserSignIn() {
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
          ar: "تسجيل الدخول - حسابك على تشطيبة | تسوق أثاث، ديكورات، سباكة، إضاءات والمزيد",
          en: "Login - Your Tashtiba Account | Shop Furniture, Plumbing, Lighting & More",
        }}
        description={{
          ar: "سجّل الدخول إلى حسابك في تشطيبة للوصول إلى جميع منتجات التشطيب: أثاث منزلي، أبواب، إضاءات، تشطيبات وسباكة، خلاطات، ديكورات وغيرها. تتبع طلباتك واحفظ منتجاتك المفضلة بكل سهولة.",
          en: "Log in to your Tashtiba account to access all finishing categories including furniture, doors, lighting, plumbing fixtures, mixers, decorations, and more. Track your orders and manage your favorites easily.",
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "تسجيل الدخول",
            "حساب المستخدم",
            "أثاث منزلي",
            "أبواب",
            "إضاءات",
            "سباكة",
            "تشطيب سباكة",
            "خلاطات",
            "ديكورات",
            "مواد تشطيب",
            "مصر",
          ],
          en: [
            "tashtiba",
            "login",
            "user account",
            "furniture",
            "doors",
            "lighting",
            "plumbing",
            "sanitary finishing",
            "mixers",
            "decorations",
            "finishing materials",
            "Egypt",
          ],
        }}
        url={`https://tashtiba.com/${lang}/signin`}
        image="https://tashtiba.com/og-image.png"
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/signin" },
          { lang: "en", href: "https://tashtiba.com/en/signin" },
          { lang: "x-default", href: "https://tashtiba.com/ar/signin" },
        ]}
        structuredData={{
          "@type": "WebPage",
          url: `https://tashtiba.com/${lang}/signin`,
          inLanguage: lang,
        }}
        lang={lang as "ar" | "en"}
      />

      <AuthLayout userType="end_user">
        <SignInForm userType="end_user" />
      </AuthLayout>
    </>
  );
}
