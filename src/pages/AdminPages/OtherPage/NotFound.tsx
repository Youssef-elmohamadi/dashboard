import GridShape from "../../../components/common/Auth/GridShape";
// import PageMeta from "../../../components/common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
import SEO from "../../../components/common/SEO/seo"; // تم التأكد من استيراد SEO
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation("NotFoundPage");
  return (
    <>
      <SEO // تم استبدال PageMeta بـ SEO وتحديد البيانات مباشرة
        title={{
          ar: "تشطيبة - الصفحة غير موجودة (404)",
          en: "Tashtiba - Page Not Found (404)",
        }}
        description={{
          ar: "عذرًا، الصفحة التي تبحث عنها غير موجودة. يرجى التحقق من الرابط أو العودة إلى الصفحة الرئيسية.",
          en: "Sorry, the page you are looking for does not exist. Please check the URL or return to the homepage.",
        }}
        keywords={{
          ar: [
            "صفحة غير موجودة",
            "خطأ 404",
            "صفحة مفقودة",
            "تشطيبة",
            "خطأ في الرابط",
          ],
          en: [
            "page not found",
            "404 error",
            "missing page",
            "Tashtiba",
            "broken link",
          ],
        }}
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
        <GridShape />
        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
            {t("error")}
          </h1>

          <img src="/images/error/404.svg" alt="404" className="dark:hidden" />
          <img
            src="/images/error/404-dark.svg"
            alt="404"
            className="hidden dark:block"
          />

          <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
            {t("description")}
          </p>

          {/* <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Back to Home Page
          </Link> */}
        </div>
        {/* */}
        <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
          &copy; {new Date().getFullYear()} - Tashtiba
        </p>
      </div>
    </>
  );
}
