import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getCategoriesPaginate,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../../../../api/SuperAdminApi/Categories/_requests";
import { AxiosError } from "axios";

export const useAllCategories = () => {
  return useQuery({
    queryKey: ["categories", "all"],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 20,
  });
};

export const useGetCategories = (page: number, filters?: any) => {
  return useQuery({
    queryKey: ["superAdminCategories", page, filters],
    queryFn: async () => {
      const response = await getCategoriesPaginate({
        page: page + 1,
        ...filters,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    onError: (error: AxiosError) => {
      console.error("حدث خطاء في جلب الصلاحيات:", error);
    },
  });
};

export const useGetCategoryById = (id?: number | string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id!),
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
      const { id } = variables;
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
    mutationFn: async (categoryData: any) => {
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

export const useUpdateCategory = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      categoryData,
      id,
    }: {
      id: number | string;
      categoryData: any;
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
