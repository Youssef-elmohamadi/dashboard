import { useEffect, useState, useCallback } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import ProductCard from "../../../components/EndUser/ProductCard/ProductCard";
import { getAllProducts } from "../../../api/EndUserApi/ensUserProducts/_requests";
import { Circles } from "react-loader-spinner";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const sort = searchParams.get("sort") || "";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";

  const fetchProducts = useCallback(
    async (pageNumber = 1, isNewQuery = false) => {
      setLoading(true);
      try {
        const response = await getAllProducts({
          sort,
          min,
          max,
          page: pageNumber,
        });

        const newProducts = response.data.data.data;

        setProducts((prev) =>
          pageNumber === 1 || isNewQuery
            ? newProducts
            : [...prev, ...newProducts]
        );

        setHasMore(
          response.data.data.current_page < response.data.data.last_page
        );

        setPage(pageNumber);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [sort, min, max]
  );

  // تحميل الصفحة الأولى عند الفتح
  useEffect(() => {
    fetchProducts(1, true);
  }, [sort, min, max]);

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchProducts(page + 1);
    }
  };

  return (
    <div className="min-h-[300px] flex flex-col items-center">
      {loading && page === 1 ? (
        <Circles height="80" width="80" color="#6B46C1" ariaLabel="loading" />
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-lg font-semibold mt-10">
          No data for this category.
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

          {hasMore && !loading && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMore}
                className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Show More
              </button>
            </div>
          )}

          {loading && page > 1 && (
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
