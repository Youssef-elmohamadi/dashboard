import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import SEO from "../../../components/common/SEO/seo"; // Assuming this path is correct
import { useTranslation } from "react-i18next";

const ProductsCompare = () => {
  const navigate = useNavigate();
  const { lang } = useParams(); // Get language from params for alternates
  const { t } = useTranslation(["EndUserCompareProducts"]); // Assuming a translation namespace for comparison page

  useEffect(() => {
    const token = localStorage.getItem("end_user_token");
    if (!token) {
      navigate(`/${lang}/signin`, { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white p-4">
      <SEO
        title={{
          ar: `تشطيبة - مقارنة المنتجات`,
          en: `Tashtiba - Product Comparison`,
        }}
        description={{
          ar: `قارن بين المنتجات المختلفة في تشطيبة لاتخاذ قرار الشراء الأمثل. شاهد المواصفات والأسعار والمميزات جنبًا إلى جنب للعثور على الأفضل لاحتياجاتك في مصر.`,
          en: `Compare different products on Tashtiba to make the best purchasing decision. See specifications, prices, and features side-by-side to find what suits your needs in Egypt.`,
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "مقارنة المنتجات",
            "مقارنة الأسعار",
            "مواصفات المنتجات",
            "أفضل المنتجات",
            "اختيار منتج",
            "مقارنة تسوق",
            "مصر",
            "تسوق",
          ],
          en: [
            "tashtiba",
            "product comparison",
            "compare products",
            "price comparison",
            "product specifications",
            "best products",
            "shopping comparison",
            "Egypt",
            "online shopping",
          ],
        }}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/compare" }, // Adjust if your actual compare URL is different
          { lang: "en", href: "https://tashtiba.com/en/compare" }, // Adjust if your actual compare URL is different
          { lang: "x-default", href: "https://tashtiba.com/en/compare" }, // Consider a default if you have one
        ]}
        robotsTag="noindex, nofollow"
      />

      <h1 className="text-3xl font-bold text-center mb-8">
        {t("comparePageTitle", { defaultValue: "مقارنة المنتجات" })}
      </h1>

      <div className="text-center text-gray-600">
        <p className="text-lg">
          {t("comparePageDescription", {
            defaultValue:
              "اختر منتجين أو أكثر لإجراء مقارنة مفصلة للمواصفات والأسعار.",
          })}
        </p>
        <p className="mt-4 text-sm text-gray-500">
          {t("compareInstructions", {
            defaultValue: "يمكنك إضافة منتجات للمقارنة من صفحة تفاصيل المنتج.",
          })}
        </p>
      </div>

      {/* Placeholder for actual comparison table/layout */}
      <div className="mt-10 border-t border-gray-200 pt-10">
        {/* This is where your actual product comparison UI will go */}
        {/* Example: <ProductComparisonTable products={comparedProducts} /> */}
        {/* <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-500 italic">
          {t("comparisonContentPlaceholder", {
            defaultValue:
              "المحتوى الفعلي للمقارنة سيظهر هنا عند إضافة المنتجات.",
          })}
        </div> */}
      </div>
    </div>
  );
};

export default ProductsCompare;
