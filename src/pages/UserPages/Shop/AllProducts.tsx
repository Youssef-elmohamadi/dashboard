import { useSearchParams } from "react-router-dom";
import ProductCard from "../../../components/EndUser/ProductCard/ProductCard";
import { Circles } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import { useAllProducts } from "../../../hooks/Api/EndUser/useProducts/useProducts";
import { Helmet } from "react-helmet-async";

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

  return (
    <div className="min-h-[300px] flex flex-col items-center">
      <Helmet>
        <title>{t("mainTitle")}</title>
        <meta
          name="description"
          content={t("mainDescription", {
            defaultValue: "اكتشف مجموعة واسعة من المنتجات المناسبة لجميع احتياجاتك بأسعار تنافسية وجودة عالية.",
          })}
        />
      </Helmet>

      {isError ? (
        <p className="text-red-500 text-lg font-semibold mt-10">
          {t("mainContent.fetchError", {
            defaultValue: "حدث خطأ ما أثناء تحميل المنتجات. حاول مرة أخرى لاحقًا.",
          })}
        </p>
      ) : isLoading ? (
        <Circles height="80" width="80" color="#6B46C1" ariaLabel="loading" />
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
