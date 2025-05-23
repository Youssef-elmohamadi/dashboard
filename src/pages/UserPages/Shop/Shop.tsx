import { useParams, useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getProductCategoriesById } from "../../../api/EndUserApi/ensUserProducts/_requests";
import ProductCard from "../../../components/EndUser/ProductCard/ProductCard";
import { Circles } from "react-loader-spinner";
import { useTranslation } from "react-i18next";

const Shop = () => {
  const { category_id } = useParams();
  const [searchParams] = useSearchParams();

  const sort = searchParams.get("sort") || "";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";
    const { t } = useTranslation(["EndUserShop"]);
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ["endUserProducts", category_id, sort, min, max],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await getProductCategoriesById({
          category_id,
          sort,
          min,
          max,
          page: pageParam,
        });

        return response.data.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        return lastPage.current_page < lastPage.last_page
          ? lastPage.current_page + 1
          : undefined;
      },
      enabled: !!category_id,
      staleTime: 1000 * 60 * 5,
    });

  const products = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="min-h-[300px] flex flex-col items-center">
      {isLoading ? (
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
