import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../../../components/EndUser/Product/ProductCard";
import { Circles } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import { useAllProducts } from "../../../hooks/Api/EndUser/useProducts/useProducts";
import SEO from "../../../components/common/SEO/seo";
import React from "react";

const AllProducts = () => {
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";
  const { t } = useTranslation(["EndUserShop"]);

  const {
    products,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isError,
  } = useAllProducts({
    sort: sort,
    min: min,
    max: max,
  });
  const { lang } = useParams();


  const productKeywords = products
    .slice(0, 8)
    .map((p) => p[`name_[${lang}]`])
    .join(", ");

  return (
    <div className="min-h-[300px] flex flex-col items-center">
      <SEO
        title={{
          ar: "كل منتجات التشطيب - سيراميك، دهانات، أدوات صحية وأكثر",
          en: "All Finishing Products - Ceramic, Paints, Sanitary Ware & More",
        }}
        description={{
          ar: "تصفح مجموعة ضخمة من منتجات التشطيب بأفضل الأسعار في مصر. خلاطات، تكييفات، دهانات، أبواب، أدوات صحية والمزيد. اطلب الآن من تشطيبة.",
          en: "Browse a huge range of finishing products at the best prices in Egypt. Mixers, air conditioners, paints, doors, sanitary ware & more. Shop now at Tashtiba.",
        }}
        keywords={{
          ar: [
            "مواد التشطيب",
            "تشطيبة",
            "تشطيب شقق",
            "سيراميك",
            "بورسلين",
            "دهانات",
            "أدوات صحية",
            "أبواب",
            "مطابخ",
            "بلاط الأرضيات",
            ...productKeywords.split(", ").slice(0, 5),
          ],
          en: [
            "finishing materials",
            "tashtiba",
            "ceramic",
            "porcelain",
            "sanitary ware",
            "paints",
            "doors",
            "kitchens",
            "floor tiles",
            "apartment finishing",
            ...productKeywords.split(", ").slice(0, 5),
          ],
        }}
        url={`https://tashtiba.com/${lang}/category`}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/category" },
          { lang: "en", href: "https://tashtiba.com/en/category" },
          { lang: "x-default", href: "https://tashtiba.com/ar/category" },
        ]}
        image="https://tashtiba.com/og-image.png"
        structuredData={{
          "@type": "WebPage",
          url: `https://tashtiba.com/${lang}/category`,
          inLanguage: lang,
        }}
        lang={lang as "ar" | "en"}
      />

      {isError ? (
        <p className="text-red-500 text-lg font-semibold mt-10 min-h-[540px]">
          {t("mainContent.fetchError", {
            defaultValue:
              "حدث خطأ ما أثناء تحميل المنتجات. حاول مرة أخرى لاحقًا.",
          })}
        </p>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-[540px]">
          {/* <LazyImage
            src="/images/product/placeholder-image.webp"
            alt={
              lang === "ar"
                ? "تحميل المنتجات - تشطيبة"
                : "Loading products - Tashtiba"
            }
            className="w-20 h-20 mb-4 animate-pulse"
          /> */}
          <Circles height="80" width="80" color="#d62828" ariaLabel="loading" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-lg font-semibold mt-10 min-h-[540px]">
          {t("mainContent.noDataForCategory")}
        </p>
      ) : (
        <>
          <div className="w-full grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-h-[540px]">
            {products.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => fetchNextPage()}
                className="px-6 py-2 bg-[#d62828] text-white rounded hover:bg-[#d62828] transition"
              >
                {isFetching ? t("mainContent.loadingMore") : t("showMore")}
              </button>
            </div>
          )}

          {isLoading && (
            <div className="mt-4">
              <Circles height="40" width="40" color="#d62828" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(AllProducts);
