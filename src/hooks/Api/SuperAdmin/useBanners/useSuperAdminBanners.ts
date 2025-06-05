import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBanner,
  deleteBanner,
  getBannerById,
  getBannersPaginate,
  updateBanner,
} from "../../../../api/SuperAdminApi/Banners/_requests";
import { AxiosError } from "axios";

export const useBannersWithPaginate = (page: number, filters?: any) => {
  return useQuery({
    queryKey: ["banners", page, filters],
    queryFn: async () => {
      const response = await getBannersPaginate({
        page: page + 1,
        ...filters,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    onError: (error: AxiosError) => {
      console.error("حدث خطأ في جلب البانرات:", error);
    },
  });
};

export const useGetBannerById = (id?: number | string) => {
  return useQuery({
    queryKey: ["banner", id],
    queryFn: () => getBannerById(id!),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await deleteBanner(id);
      return res;
    },
    onSuccess: (_, variables) => {
      const { id } = variables;
      queryClient.invalidateQueries({ queryKey: ["Banners"] });
      queryClient.invalidateQueries({ queryKey: ["Banner", id] });
      queryClient.invalidateQueries({ queryKey: ["banners", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bannerData: any) => {
      return await createBanner(bannerData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      queryClient.invalidateQueries({ queryKey: ["banners", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateBanner = (id: number|string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bannerData, id }: { id: number; bannerData: any }) => {
      return await updateBanner(bannerData, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      queryClient.invalidateQueries({ queryKey: ["banner", id] });
      queryClient.invalidateQueries({ queryKey: ["banners", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
