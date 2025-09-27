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
          ar: "تسجيل الدخول - حسابك على تشطيبة | متابعة الطلبات والمفضلة",
          en: "Login - Your Tashtiba Account | Track Orders & Favorites",
        }}
        description={{
          ar: "سجّل الدخول إلى حسابك في تشطيبة للوصول إلى جميع منتجات التشطيب وتتبع طلباتك وحفظ المفضلة بسهولة.",
          en: "Log in to your Tashtiba account to access all finishing categories, track your orders, and manage favorites easily.",
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
        pageType="login"
        lang={lang as "ar" | "en"}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          url: "https://tashtiba.com/",
          name: {
            ar: "تشطيبة",
            en: "Tashtiba",
          },
          inLanguage: lang,
          alternateName: ["Tashtiba", "تشطيبة"],
          sameAs: ["https://tashtiba.com/ar", "https://tashtiba.com/en"],
          publisher: {
            "@type": "Organization",
            name: {
              ar: "تشطيبة",
              en: "Tashtiba",
            },
            logo: {
              "@type": "ImageObject",
              url: "https://tashtiba.com/images/logo/ar-dark-logo.webp",
              width: 200,
              height: 60,
            },
          },
        }}
      />

      <AuthLayout userType="end_user">
        <SignInForm userType="end_user" />
      </AuthLayout>
    </>
  );
}
