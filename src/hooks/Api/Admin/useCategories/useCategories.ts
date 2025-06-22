import { useQuery } from "@tanstack/react-query";
import {
  getAllCategories,
  getCategoriesPaginate,
} from "../../../../api/AdminApi/categoryApi/_requests";
import {
  AllCategoriesData,
  CategoryFilters,
  PaginatedCategoriesData,
} from "../../../../types/Categories";

export const useAllCategories = () => {
  return useQuery<AllCategoriesData>({
    queryKey: ["categories", "all"],
    staleTime: 1000 * 60 * 20,
    queryFn: async () => {
      const response = await getAllCategories();
      return response.data.data;
    },
  });
};

export const useAllCategoriesPaginate = (
  page: number,
  filters?: CategoryFilters
) => {
  return useQuery<PaginatedCategoriesData>({
    queryKey: ["categories", page, filters],
    queryFn: async () => {
      const response = await getCategoriesPaginate({
        page: page + 1,
        ...filters,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 4,
  });
};
