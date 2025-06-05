import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getAllProducts,
  getProductCategoriesById,
} from "../../../../api/EndUserApi/ensUserProducts/_requests";

interface UseAllProductsProps {
  sort?: string;
  min?: number | string;
  max?: number | string;
}
interface UseProductsByCategoryProps {
  category_id?: number | string;
  sort?: string;
  min?: number | string;
  max?: number | string;
}

export const useAllProducts = ({ sort, min, max }: UseAllProductsProps) => {
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ["endUserAllProducts", sort, min, max],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await getAllProducts({
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
      staleTime: 1000 * 60 * 5,
    });

  const products = data?.pages.flatMap((page) => page.data) || [];

  return {
    products,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
  };
};

export const useProductsByCategory = ({
  category_id,
  sort,
  min,
  max,
}: UseProductsByCategoryProps) => {
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
      getNextPageParam: (lastPage) =>
        lastPage.current_page < lastPage.last_page
          ? lastPage.current_page + 1
          : undefined,
      enabled: !!category_id, // Important: only runs if category_id exists
      staleTime: 1000 * 60 * 5,
    });

  const products = data?.pages.flatMap((page) => page.data) || [];

  return {
    products,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
  };
};
