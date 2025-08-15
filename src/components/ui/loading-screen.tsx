import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import "./loading-screen.css";
export default function LoadingPage() {
  const { t } = useTranslation("LoadingPage");
  const { lang } = useParams();
  const LOGO_PATH = `/images/logo/${lang}-light-logo.webp`;
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 z-[9999]">
      <div className="text-center p-5">
        <div className="flex items-center justify-center gap-4 mb-5">
          <img
            src={LOGO_PATH}
            alt="TashTiba Logo"
            className="w-20 h-20 animate-spin"
          />
        </div>
        <h1 className="text-4xl font-bold text-red-600">{t("site_name")}</h1>

        <p className="text-lg text-gray-700 mb-8">{t("marketing_slogan")}</p>

        <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden mx-auto mb-5">
          <div className="w-full h-full bg-red-600 animate-loading-fill"></div>
        </div>

        <p className="text-gray-500 text-sm">{t("loading")}</p>
      </div>
    </div>
  );
}
