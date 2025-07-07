import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCoupon,
  deleteCoupon,
  getCouponsWithPaginate,
  showCoupon,
  updateCoupon,
} from "../../../../api/SuperAdminApi/couponsApi/_requests";
import {
  Coupon,
  CouponInput,
  PaginatedCoupons,
} from "../../../../types/Coupons";

type CouponFilters = {
  active?: string;
  code?: string;
  type?: string;
  from_date?: string;
  to_date?: string;
};
export const useAllCoupons = (page: number, filters?: CouponFilters) => {
  return useQuery<PaginatedCoupons>({
    queryKey: ["coupons", page, filters],
    queryFn: async () => {
      const response = await getCouponsWithPaginate({
        page: page + 1,
        ...filters,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 4,
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      return await deleteCoupon(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["coupons", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData: CouponInput) => {
      return await createCoupon(productData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["coupons", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetCouponById = (id: number | string) => {
  return useQuery<Coupon>({
    queryKey: ["coupon", id],
    queryFn: async () => {
      const response = await showCoupon(id!);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useUpdateCoupon = (id: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      couponData,
      id,
    }: {
      couponData: CouponInput;
      id: number;
    }) => {
      return await updateCoupon(id, couponData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["coupons", "all"] });
      queryClient.invalidateQueries({ queryKey: ["coupon", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
