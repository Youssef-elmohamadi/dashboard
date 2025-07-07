import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getCategoriesPaginate,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../../../../api/SuperAdminApi/Categories/_requests";
import {
  AllCategoriesData,
  Category,
  CategoryFilters,
  PaginatedCategoryOriginal,
} from "../../../../types/Categories";

export const useAllCategories = () => {
  return useQuery<AllCategoriesData>({
    queryKey: ["categories", "all"],
    queryFn: async () => {
      const response = await getAllCategories();
      return response.data.data;
    },
    staleTime: 1000 * 60 * 20,
  });
};

export const useGetCategories = (page: number, filters?: CategoryFilters) => {
  return useQuery<PaginatedCategoryOriginal>({
    queryKey: ["superAdminCategories", page, filters],
    queryFn: async () => {
      const response = await getCategoriesPaginate({
        page: page + 1,
        ...filters,
      });

      return response.data.data.original;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetCategoryById = (id?: number | string) => {
  return useQuery<Category>({
    queryKey: ["category", id],
    queryFn: async () => {
      const response = await getCategoryById(id!);
      return response.data.data.original;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await deleteCategory(id);
      console.error("deleteCategory response", res); // 👈 تحقق من هذا
      return res;
    },
    onSuccess: (_, variables) => {
      const id = variables;
      queryClient.invalidateQueries({ queryKey: ["superAdminCategories"] });
      queryClient.invalidateQueries({ queryKey: ["superAdminCategories", id] });
      queryClient.invalidateQueries({ queryKey: ["categories", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryData: FormData) => {
      return await createCategory(categoryData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superAdminCategories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateCategory = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      categoryData,
      id,
    }: {
      id: string;
      categoryData: FormData;
    }) => {
      return await updateCategory(categoryData, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superAdminCategories"] });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
