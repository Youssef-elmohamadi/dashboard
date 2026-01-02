import { Link, useNavigate } from "react-router-dom";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useTranslation } from "react-i18next";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5"; // تأكد من تثبيت react-icons

const CheckoutHeader = () => {
  const { lang } = useDirectionAndLanguage();
  const { t } = useTranslation(["EndUserCheckout"]);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b-2 border-[#d62828] py-3 sticky top-0 z-[1000] backdrop-blur-md bg-white/95">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* زر العودة للسلة */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#d62828] transition-colors group"
        >
          {lang === "ar" ? (
            <IoArrowForwardOutline className="text-xl group-hover:translate-x-1 transition-transform" />
          ) : (
            <IoArrowBackOutline className="text-xl group-hover:-translate-x-1 transition-transform" />
          )}
          <span className="text-sm font-bold hidden sm:block">
            {t("back_to_cart", "العودة للسلة")}
          </span>
        </button>

        {/* اللوجو في المنتصف */}
        <Link
          to={`/${lang}`}
          className="flex items-center absolute left-1/2 -translate-x-1/2"
          aria-label="Tashtiba Home"
        >
          <img
            src={`/images/logo/${lang}-light-logo.webp`}
            alt="Tashtiba Logo"
            className="w-[100px] md:w-[120px] object-contain"
          />
        </Link>

        {/* مساحة فارغة في اليمين لموازنة الهيدر (أو يمكن وضع نص 'دفع آمن') */}
        <div className="hidden sm:flex items-center gap-2 text-green-600">
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {t("secure_checkout", "دفع آمن")}
          </span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;
