import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeStatus,
  getBrandById,
  getBrandsWithPaginate,
} from "../api/SuperAdminApi/Brands/_requests";
import { AxiosError } from "axios";

export const useGetBrandsPaginate = (page: number, filters?: any) => {
  return useQuery({
    queryKey: ["brands", page, filters],
    queryFn: async () => {
      const response = await getBrandsWithPaginate({
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

export const useGetBrandById = (id: number) => {
  return useQuery({
    queryKey: ["brand", id],
    queryFn: () => getBrandById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useChangeBrandStatus = () => {
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
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["brand", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
