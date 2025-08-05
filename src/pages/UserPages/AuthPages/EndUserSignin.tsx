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
      navigate(`/${lang}/`, { replace: true });
    }
  }, [navigate, lang]);

  return (
    <>
      <SEO
        title={{
          ar: `تسجيل الدخول - حسابك على تشطيبة | تسوق مواد التشطيب في مصر`,
          en: `Login - Your Tashtiba Account | Shop Finishing Materials in Egypt`,
        }}
        description={{
          ar: `سجّل الدخول إلى حسابك في تشطيبة لتتبع الطلبات، حفظ المنتجات، وإكمال عمليات الشراء بسهولة. تسوق أفضل مواد التشطيب في مصر أونلاين.`,
          en: `Log in to your Tashtiba account to track your orders, save products, and complete purchases easily. Shop the best finishing materials in Egypt online.`,
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
            "مواد تشطيب",
            "شراء أونلاين",
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
            "finishing materials",
            "buy online",
          ],
        }}
        url={`https://tashtiba.com/${lang}/signin`}
        image="https://tashtiba.com/og-image.png"
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/signin" },
          { lang: "en", href: "https://tashtiba.com/en/signin" },
        ]}
      />

      <AuthLayout userType="end_user">
        <SignInForm userType="end_user" />
      </AuthLayout>
    </>
  );
}
