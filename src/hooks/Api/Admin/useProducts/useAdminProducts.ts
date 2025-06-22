import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProductsPaginate,
  updateProduct,
  createProduct,
  deleteProduct,
  showProduct,
} from "../../../../api/AdminApi/products/_requests";
import { ProductFilters } from "../../../../types/Product";
import { ID } from "../../../../types/Common";

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
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: ID) => {
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

export const useGetProductById = (id?: number | string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => showProduct(id!),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useUpdateProduct = (id: string | undefined) => {
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
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
