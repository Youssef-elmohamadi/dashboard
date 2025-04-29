import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import CategoryBreadCrump from "../../../components/EndUser/BreadCrump/CategoryBreadCrump";
import { getProductCategoriesById } from "../../../api/EndUserApi/ensUserProducts/_requests";
import ProductCard from "../../../components/EndUser/ProductCard/ProductCard";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const { category_id } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductCategoriesById(category_id);
        const productsData = response.data.data.data || [];
        setProducts(productsData);
        console.log(productsData);
      } catch (error) {
        console.log(error);
      }
    };

    if (category_id) {
      fetchProducts();
    }
  }, [category_id]);

  return (
    <div>
      <div className="w-full grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
