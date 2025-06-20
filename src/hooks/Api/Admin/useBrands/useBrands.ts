import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandById,
  getBrandsPaginate,
  updateBrand,
} from "../../../../api/AdminApi/brandsApi/_requests";
// import { AxiosError } from "axios";
import {
  PaginatedBrandsData,
  UpdateBrandParams,
} from "../../../../types/Brands";
import { ID } from "../../../../types/Common";
type BrandFilters = {
  name?: string;
};

export const useAllBrands = () => {
  return useQuery({
    queryKey: ["brands", "all"],
    queryFn: getAllBrands,
    staleTime: 1000 * 60 * 4,
  });
};

export const useAllBrandsPaginate = (page: number, filters?: BrandFilters) => {
  return useQuery<PaginatedBrandsData>({
    queryKey: ["brands", page, filters],
    queryFn: async () => {
      const response = await getBrandsPaginate({
        page: page + 1,
        ...filters,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 4,
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: ID) => {
      return await deleteBrand(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["brands", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (brandData: FormData) => {
      return await createBrand(brandData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["brands", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetBrandById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["brand", id],
    queryFn: () => getBrandById(id!),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useUpdateBrand = (id: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ brandData, id }: UpdateBrandParams) => {
      return await updateBrand(brandData, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["brands", "all"] });
      queryClient.invalidateQueries({ queryKey: ["brand", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
