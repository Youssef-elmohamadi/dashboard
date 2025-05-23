import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../../components/EndUser/ProductCard/ProductCard";
import {
  removeItem,
  clear,
} from "../../../components/EndUser/Redux/wishListSlice/WishListSlice";

const ProductsFavorite = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.wishList.items);

  if (!items || items.length === 0) {
    return (
      <p className="text-center text-gray-500">
        You don't have any products in your WishList
      </p>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative group border border-gray-200 rounded-xl overflow-hidden shadow-sm transition duration-300 hover:shadow-lg"
          >
            <button
              onClick={() => dispatch(removeItem(item.id))}
              className="absolute top-2 z-20 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition duration-300"
              title="Remove from Wishlist"
            >
              ✕
            </button>
            <ProductCard product={item} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => dispatch(clear())}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Clear All Favorites
        </button>
      </div>
    </div>
  );
};

export default ProductsFavorite;
