import { useQuery } from "@tanstack/react-query";
import {
  getAllCategories,
  getCategoriesPaginate,
} from "../../../../api/AdminApi/categoryApi/_requests";
import { AxiosError } from "axios";

type ProductFilters = {
  name?: string;
};
export const useAllCategories = () => {
  return useQuery({
    queryKey: ["categories", "all"],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 20,
  });
};

export const useAllCategoriesPaginate = (
  page: number,
  filters?: ProductFilters
) => {
  return useQuery({
    queryKey: ["categories", page, filters],
    queryFn: async () => {
      const response = await getCategoriesPaginate({
        page: page + 1,
        ...filters,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 4,
    onError: (error: AxiosError) => {
      console.error("حدث خطأ أثناء جلب المشرفين:", error);
    },
  });
};
