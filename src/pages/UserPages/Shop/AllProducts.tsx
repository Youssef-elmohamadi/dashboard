import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ProductCard from "../../../components/EndUser/ProductCard/ProductCard";
import { getAllProducts } from "../../../api/EndUserApi/ensUserProducts/_requests";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { setCurrentPage } = useOutletContext();

  const fetchProducts = async (pageNumber = 1) => {
    try {
      const response = await getAllProducts(pageNumber);
      const newProducts = response.data.data.data;

      setProducts((prev) =>
        pageNumber === 1 ? newProducts : [...prev, ...newProducts]
      );


      if (response.data.data.current_page >= response.data.data.last_page) {
        setHasMore(false);
      }

      setPage(pageNumber);
      setCurrentPage("All Categories");
    } catch (error) {
      console.log(error);
    }
  };

  // تحميل أول صفحة عند أول تحميل
  useEffect(() => {
    fetchProducts(1);
  }, []);

  const loadMore = () => {
    fetchProducts(page + 1);
  };

  return (
    <div>
      <div className="w-full grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
