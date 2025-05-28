import { getProductById } from "./../api/SuperAdminApi/Products/_requests";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProductsPaginate,
  updateProduct,
  createProduct,
  deleteProduct,
} from "../api/AdminApi/products/_requests";
import { AxiosError } from "axios";

type ProductFilters = {
  category_id?: string;
  brand_id?: string;
  status?: string;
  name?: string;
};
export const useAllProducts = (page: number, filters?: ProductFilters) => {
  return useQuery({
    queryKey: ["adminProducts", page, filters],
    queryFn: async () => {
      const response = await getProductsPaginate({
        page: page + 1,
        ...filters,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 4,
    onError: (error: AxiosError) => {
      console.error("حدث خطأ أثناء جلب المنتجات:", error);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      return await deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      //queryClient.invalidateQueries({ queryKey: ["products", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData: any) => {
      return await createProduct(productData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      //queryClient.invalidateQueries({ queryKey: ["products", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetProductById = (id?: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useUpdateProduct = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productData,
      id,
    }: {
      productData: any;
      id: number;
    }) => {
      return await updateProduct(productData, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      //queryClient.invalidateQueries({ queryKey: ["products", "all"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
