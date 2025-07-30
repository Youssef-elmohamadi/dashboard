import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkout } from "../../../../api/EndUserApi/ensUserProducts/_requests";
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
