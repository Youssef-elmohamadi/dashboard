import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getProductCategoriesById } from "../../../api/EndUserApi/ensUserProducts/_requests";
import ProductCard from "../../../components/EndUser/ProductCard/ProductCard";
import { Circles } from "react-loader-spinner";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const { category_id } = useParams();
  const [searchParams] = useSearchParams();

  const sort = searchParams.get("sort") || "";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";

  // Reset data when filters or category changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1, true);
  }, [category_id, sort, min, max]);

  const fetchProducts = useCallback(
    async (pageNumber = 1, isFirstLoad = false) => {
      if (!category_id) return;
      setLoading(true);
      try {
        const response = await getProductCategoriesById({
          category_id,
          sort,
          min,
          max,
          page: pageNumber,
        });

        const data = response.data.data;
        const newProducts = data.data || [];

        setProducts((prev) =>
          isFirstLoad ? newProducts : [...prev, ...newProducts]
        );
        setHasMore(data.current_page < data.last_page);
        setPage(data.current_page);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [category_id, sort, min, max]
  );

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchProducts(page + 1);
    }
  };

  return (
    <div className="min-h-[300px] flex flex-col items-center">
      {loading && products.length === 0 ? (
        <Circles height="80" width="80" color="#6B46C1" ariaLabel="loading" />
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-lg font-semibold">
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
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loading}
              className="mt-6 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Shop;
