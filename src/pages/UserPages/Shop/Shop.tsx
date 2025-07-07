import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../../../components/EndUser/Product/ProductCard";
import { Circles } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import { useProductsByCategory } from "../../../hooks/Api/EndUser/useProducts/useProducts";
import { useEffect, useState } from "react";
import { useAllCategories } from "../../../hooks/Api/Admin/useCategories/useCategories";
import { Category } from "../../../types/Categories";
import LazyImage from "../../../components/common/LazyImage";
import SEO from "../../../components/common/SEO/seo";

const Shop = () => {
  const { category_id, lang } = useParams();
  const [searchParams] = useSearchParams();
  const [categoryName, setCategoryName] = useState("");
  const sort = searchParams.get("sort") || "";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";

  const { t } = useTranslation(["EndUserShop"]);
  const { data } = useAllCategories();
  const categories = data?.original;

  useEffect(() => {
    const category = categories?.find(
      (cat: Category) => cat.id.toString() === category_id
    );
    setCategoryName(category?.name ?? "");
  }, [category_id, categories]);

  const {
    products,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
  } = useProductsByCategory({
    category_id,
    sort,
    min,
    max,
  });

  return (
    <div className="min-h-[300px] flex flex-col items-center">
      <SEO
        title={{
          ar: `تشطيبة - ${categoryName}`,
          en: `Tashtiba - ${categoryName}`,
        }}
        description={{
          ar: `تصفح منتجات فئة ${categoryName} بأفضل الأسعار على تشطيبة.`,
          en: `Browse the best deals in ${categoryName} on Tashtiba.`,
        }}
        keywords={{
          ar: [
            "تشطيبة",
            categoryName,
            "تسوق",
            "منتجات",
            "مصر",
            "فئة",
            "خصومات",
          ],
          en: [
            "tashtiba",
            categoryName,
            "shop",
            "products",
            "category",
            "offers",
            "Egypt",
          ],
        }}
        alternates={[
          { lang: "ar", href: "https://tashtiba.vercel.app/ar" },
          { lang: "en", href: "https://tashtiba.vercel.app/en" },
        ]}
      />

      {isError ? (
        <p className="text-red-500 text-lg font-semibold mt-10">
          {t("mainContent.fetchError", {
            defaultValue:
              "حدث خطأ ما أثناء تحميل المنتجات. حاول مرة أخرى لاحقًا.",
          })}
        </p>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <LazyImage
            src="/images/product/placeholder-image.jpg"
            alt={
              lang === "ar"
                ? `تحميل منتجات ${categoryName}`
                : `Loading ${categoryName} products`
            }
            className="w-20 h-20 mb-4 animate-pulse"
          />
          <Circles height="80" width="80" color="#6B46C1" ariaLabel="loading" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-lg font-semibold mt-10">
          {t("mainContent.noDataForCategory")}
        </p>
      ) : (
        <>
          <div className="w-full grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetching}
              className="mt-6 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              {isFetching ? t("mainContent.loadingMore") : t("showMore")}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Shop;
