import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  checkout,
  getCheckoutInfo,
  transportInfo,
} from "../../../../api/EndUserApi/ensUserProducts/_requests";
import { Checkout } from "../../../../types/CheckoutType";

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (checkoutData: Checkout) => {
      const res = await checkout(checkoutData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["EndUserOrders"] });
      queryClient.invalidateQueries({ queryKey: ["endUserAllProducts"] });
      queryClient.invalidateQueries({ queryKey: ["endUserProducts"] });
      queryClient.invalidateQueries({ queryKey: ["productData"] });
    },
    onError: (error) => {
      console.error("Checkout failed:", error);
    },
  });
};

export const useCheckoutInfo = () => {
  return useQuery({
    queryKey: ["checkoutInfo"],
    queryFn: async () => {
      const res = await getCheckoutInfo();
      return res;
    },
    staleTime: 1000 * 60 * 20,
  });
};
export const useTransportInfo = () => {
  return useQuery({
    queryKey: ["transportInfo"],
    queryFn: async () => {
      const res = await transportInfo();
      return res;
    },
    staleTime: 1000 * 60 * 20,
  });
};


