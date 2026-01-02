import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    changeStatus,
  getProductById,
  getProductsWithPaginate,
} from "../../../../api/SuperAdminApi/Products/_requests";
import { ProductsPaginate } from "../../../../types/Product";

export const useGetProductsPaginate = (page: number, filters?: any) => {
  return useQuery<ProductsPaginate>({
    queryKey: ["superAdminProducts", page, filters],
    queryFn: async () => {
      const response = await getProductsWithPaginate({
        page: page + 1,
        ...filters,
      });
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetProductById = (id: number | string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useChangeProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { status: string };
    }) => {
      return await changeStatus(id, data);
    },
    onSuccess: (_, variables) => {
      const { id } = variables;
      queryClient.invalidateQueries({ queryKey: ["superAdminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
