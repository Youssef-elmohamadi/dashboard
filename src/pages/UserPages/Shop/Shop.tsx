import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../../../components/EndUser/ProductCard/ProductCard";
import { Circles } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import { useProductsByCategory } from "../../../hooks/Api/EndUser/useProducts/useProducts";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useAllCategories } from "../../../hooks/Api/Admin/useCategories/useCategories";
type Category = {
  id: number | string;
};
const Shop = () => {
  const { category_id } = useParams();
  const [searchParams] = useSearchParams();
  const [categoryName, setCategoryName] = useState("");
  const sort = searchParams.get("sort") || "";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";
  const { t } = useTranslation(["EndUserShop"]);
  const { data } = useAllCategories();
  const categories = data?.data?.data.original;
  useEffect(() => {
    const category = categories?.find(
      (cat: Category) => cat.id.toString() === category_id
    );
    setCategoryName(category?.name);
  }, [category_id, categories]);
  console.log(categoryName);

  const {
    products,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
  } = useProductsByCategory({
    category_id: category_id,
    sort: sort,
    min: min,
    max: max,
  });

  return (
    <div className="min-h-[300px] flex flex-col items-center">
      <Helmet>
        <title>{t("mainTitleCategory", { categoryName: categoryName })}</title>
        <meta
          name="description"
          content={t("categoryDescription", {
            categoryName: categoryName,
            defaultValue:
              "تسوق من مجموعة متنوعة من المنتجات داخل هذه الفئة بأسعار تنافسية وجودة عالية.",
          })}
        />
      </Helmet>

      {isError ? (
        <p className="text-red-500 text-lg font-semibold mt-10">
          {t("mainContent.fetchError", {
            defaultValue:
              "حدث خطأ ما أثناء تحميل المنتجات. حاول مرة أخرى لاحقًا.",
          })}
        </p>
      ) : isLoading ? (
        <Circles height="80" width="80" color="#6B46C1" ariaLabel="loading" />
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-lg font-semibold">
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
