import { useMutation } from "@tanstack/react-query";
import { applyCoupon } from "../../../../api/EndUserApi/ensUserProducts/_requests";
interface CouponRequest {
  code: string;
  order_total: number;
}

interface CouponResponse {
  discount: number;
  message: string;
}
export const useApplyCoupon = () => {
  return useMutation<CouponResponse, Error, CouponRequest>({
    mutationFn: async (data) => {
      const res = await applyCoupon(data);
      return res.data;
    },
  });
};
