import { useEffect } from "react";
import AuthLayout from "../../../components/common/Auth/AuthPageLayout";
import ResetPassword from "../../../components/common/Auth/ResetPassword";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import SEO from "../../../components/common/SEO/seo"; // Import your custom SEO component

const UserForgotPassword = () => {
  const { t } = useTranslation(["auth"]);
  const navigate = useNavigate();
  const { lang } = useDirectionAndLanguage(); // Assuming this context provides 'lang'

  useEffect(() => {
    // Redirect authenticated users away from the password reset page
    const token = localStorage.getItem("end_user_token");
    if (token) {
      navigate(`/${lang}/`, { replace: true });
    }
  }, [navigate, lang]); // Added lang to dependency array

  return (
    <>
      <SEO
        title={{
          ar: `تشطيبة - استعادة كلمة المرور`,
          en: `Tashtiba - Reset Password`,
        }}
        description={{
          ar: `استعد كلمة مرور حسابك في تشطيبة بسهولة وأمان. أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور.`,
          en: `Easily and securely reset your Tashtiba account password. Enter your email address to receive a password reset link.`,
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "نسيت كلمة المرور",
            "استعادة كلمة المرور",
            "إعادة تعيين كلمة المرور",
            "تسجيل الدخول",
            "المساعدة",
            "الأمان",
            "حسابي",
            "مصر",
          ],
          en: [
            "tashtiba",
            "forgot password",
            "reset password",
            "password recovery",
            "login help",
            "account security",
            "my account",
            "Egypt",
          ],
        }}
        alternates={[
          // Assuming your forgot password page URL structure is like /ar/forgot-password
          {
            lang: "ar",
            href: "https://tashtiba.com/ar/forgot-password",
          },
          {
            lang: "en",
            href: "https://tashtiba.com/en/forgot-password",
          },
          {
            lang: "x-default",
            href: "https://tashtiba.com/en/forgot-password",
          }, // Default to English
        ]}
      />
      <div>
        <AuthLayout userType="end_user">
          <ResetPassword type="user" />
        </AuthLayout>
      </div>
    </>
  );
};

export default UserForgotPassword;
