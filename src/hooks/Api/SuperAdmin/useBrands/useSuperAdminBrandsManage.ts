import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeStatus,
  getAllBrands,
  getBrandById,
  getBrandsWithPaginate,
} from "../../../../api/SuperAdminApi/Brands/_requests";
import {
  AllBrandsData,
  Brand,
  PaginatedBrandsData,
} from "../../../../types/Brands";
export const useAllBrands = () => {
  return useQuery<AllBrandsData>({
    queryKey: ["brands", "all"],
    queryFn: async () => {
      const response = await getAllBrands();
      return response.data;
    },
    staleTime: 1000 * 60 * 20,
  });
};
export const useGetBrandsPaginate = (page: number, filters?: any) => {
  return useQuery<PaginatedBrandsData>({
    queryKey: ["brands", page, filters],
    queryFn: async () => {
      const response = await getBrandsWithPaginate({
        page: page + 1,
        ...filters,
      });
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetBrandById = (id: string | undefined) => {
  return useQuery<Brand>({
    queryKey: ["brand", id],
    queryFn: async () => {
      const response = await getBrandById(id!);
      return response.data.data;
    },
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
