import { useMutation } from "@tanstack/react-query";
import { applyCoupon } from "../../../../api/EndUserApi/ensUserProducts/_requests";
import { CouponRequest, CouponResponse } from "../../../../types/Coupons";



export const useApplyCoupon = () => {
  return useMutation<CouponResponse, Error, CouponRequest>({
    mutationFn: async (data) => {
      const res = await applyCoupon(data);
      return res.data;
    },
  });
};
