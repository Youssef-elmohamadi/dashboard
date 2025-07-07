import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBanner,
  deleteBanner,
  getBannerById,
  getBannersPaginate,
  updateBanner,
} from "../../../../api/SuperAdminApi/Banners/_requests";
import { SearchValues } from "../../../../types/Banners";
import { Banner, BannersApiResponse } from "../../../../types/Banners";

export const useBannersWithPaginate = (
  page: number,
  filters?: SearchValues
) => {
  return useQuery<BannersApiResponse>({
    queryKey: ["banners", page, filters],
    queryFn: async () => {
      const response = await getBannersPaginate({
        page: page + 1,
        ...filters,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// ✅ جلب بانر واحد بالتفاصيل
export const useGetBannerById = (id?: number | string) => {
  return useQuery<Banner>({
    queryKey: ["banner", id],
    queryFn: async () => {
      const response = await getBannerById(id!);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

// ✅ حذف بانر
export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await deleteBanner(id);
      return res;
    },
    onSuccess: (_, variables) => {
      const id = variables;
      queryClient.invalidateQueries({ queryKey: ["Banners"] });
      queryClient.invalidateQueries({ queryKey: ["Banner", id] });
      queryClient.invalidateQueries({ queryKey: ["banners", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

// ✅ إنشاء بانر جديد
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

// ✅ تعديل بانر
export const useUpdateBanner = (id: number | string) => {
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
