import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../../../components/EndUser/Product/ProductCard";
import { Circles } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import { useAllProducts } from "../../../hooks/Api/EndUser/useProducts/useProducts";
import SEO from "../../../components/common/SEO/seo";
import LazyImage from "../../../components/common/LazyImage";

const AllProducts = () => {
  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";
  const { t } = useTranslation(["EndUserShop"]);
  const { lang } = useParams();

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

  return (
    <div className="min-h-[300px] flex flex-col items-center">
      <SEO
        title={{
          ar: "تشطيبة - كل المنتجات",
          en: "Tashtiba - All Products",
        }}
        description={{
          ar: "تصفح جميع المنتجات المتوفرة في تشطيبة، من ملابس، إلكترونيات، أثاث، أدوات منزلية والمزيد بأسعار تنافسية.",
          en: "Browse all available products on Tashtiba including fashion, electronics, furniture, home goods, and more at competitive prices.",
        }}
        keywords={{
          ar: [
            "كل المنتجات",
            "تشطيبة",
            "تسوق",
            "إلكترونيات",
            "أزياء",
            "أدوات منزلية",
            "موبايلات",
            "شنط",
            "أحذية",
            "سوق مصر",
          ],
          en: [
            "all products",
            "tashtiba",
            "shopping",
            "electronics",
            "fashion",
            "home goods",
            "mobiles",
            "bags",
            "shoes",
            "Egypt marketplace",
          ],
        }}
        alternates={[
          { lang: "ar", href: "https://tashtiba.vercel.app/ar" },
          { lang: "en", href: "https://tashtiba.vercel.app/en" },
          // { lang: "x-default", href: "https://tashtiba.vercel.app/en" },
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
                ? "تحميل المنتجات - تشطيبة"
                : "Loading products - Tashtiba"
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
            <div className="flex justify-center mt-6">
              <button
                onClick={() => fetchNextPage()}
                className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                {isFetching ? t("mainContent.loadingMore") : t("showMore")}
              </button>
            </div>
          )}

          {isLoading && (
            <div className="mt-4">
              <Circles height="40" width="40" color="#6B46C1" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllProducts;
