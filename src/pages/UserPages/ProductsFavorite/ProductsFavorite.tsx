import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../../components/EndUser/ProductCard/ProductCard";
import {
  removeItem,
  clear,
} from "../../../components/EndUser/Redux/wishListSlice/WishListSlice";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFavoriteProducts } from "../../../api/EndUserApi/ensUserProducts/_requests";

const ProductsFavorite = () => {
  const dispatch = useDispatch();
  // const items = useSelector((state) => state.wishList.items);

  
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ["endUserFavoriteProducts"],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await getFavoriteProducts({
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
        staleTime: 1000 * 60 * 5,
      });
      
      const products = data?.pages.flatMap((page) => page.data) || [];
      console.log(products);
      
      if (!products || products.length === 0) {
        return (
          <p className="text-center text-gray-500">
            You don't have any products in your WishList
          </p>
        );
      }
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((item) => (
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
            <ProductCard product={item.product} />
          </div>
        ))}
      </div>

<div className="mt-6 flex justify-center gap-4 flex-wrap">
  {/* <button
    onClick={() => dispatch(clear())}
    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
  >
    مسح الكل
  </button> */}

  {hasNextPage && (
    <button
      onClick={() => fetchNextPage()}
      disabled={isFetching}
      className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isFetching ? "جاري التحميل..." : "عرض المزيد"}
    </button>
  )}
</div>
    </div>
  );
};

export default ProductsFavorite;
