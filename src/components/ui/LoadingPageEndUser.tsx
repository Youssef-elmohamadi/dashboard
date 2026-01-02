import { Circles } from "react-loader-spinner";
import { useParams } from "react-router";

const LoadingPageEndUser = () => {
  const { lang } = useParams();

  const isUrlEn =
    typeof window !== "undefined" && window.location.pathname.startsWith("/en");
  const currentLang = lang === "en" || (!lang && isUrlEn) ? "en" : "ar";

  const texts = TRANSLATIONS[currentLang];
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      {/* Loader with glow */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-red-600/20 blur-xl animate-pulse" />

        <Circles height="80" width="80" color="#d62828" ariaLabel="loading" />
      </div>

      {/* Text */}
      <p className="mt-6 text-sm font-medium text-gray-600 animate-bounce">
        {texts.loading}
      </p>
    </div>
  );
};

export default LoadingPageEndUser;
const TRANSLATIONS = {
  ar: {
    loading: "جاري التحميل...",
    marketing_slogan: "تشطيبة دليلك الشامل للتشطيبات في مصر",
  },
  en: {
    loading: "Loading...",
    marketing_slogan: "TashTiba: Your complete guide for finishing in Egypt",
  },
} as const;
