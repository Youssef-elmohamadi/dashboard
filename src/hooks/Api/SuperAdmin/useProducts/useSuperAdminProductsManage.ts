import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AxiosError } from "axios";
import {
    changeStatus,
  getProductById,
  getProductsWithPaginate,
} from "../../../../api/SuperAdminApi/Products/_requests";

export const useGetProductsPaginate = (page: number, filters?: any) => {
  return useQuery({
    queryKey: ["superAdminProducts", page, filters],
    queryFn: async () => {
      const response = await getProductsWithPaginate({
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

export const useGetProductById = (id: number) => {
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
