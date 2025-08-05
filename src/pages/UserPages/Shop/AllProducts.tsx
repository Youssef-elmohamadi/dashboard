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
  console.log(lang);

  return (
    <div className="min-h-[300px] flex flex-col items-center">
      <SEO
        title={{
          ar: "تشطيبة - كل منتجات التشطيب",
          en: "Tashtiba - All Finishing Materials",
        }}
        description={{
          ar: "تصفح جميع مواد التشطيب المتوفرة في تشطيبة مثل السيراميك، البورسلين، الأدوات الصحية، الدهانات، الأبواب، المطابخ والمزيد بأفضل الأسعار.",
          en: "Browse all finishing materials available on Tashtiba including ceramic, porcelain, sanitary ware, paints, doors, kitchens and more at the best prices.",
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
          ],
        }}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/category" },
          { lang: "en", href: "https://tashtiba.com/en/category" },
          { lang: "x-default", href: "https://tashtiba.com/en/category" },
        ]}
        url={`https://tashtiba.com/${lang}/category`}
        image="https://tashtiba.com/og-image.png"
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
