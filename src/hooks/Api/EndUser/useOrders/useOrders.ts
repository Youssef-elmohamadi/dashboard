import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelOrder,
  getOrderById,
  getOrdersWithPaginate,
} from "../../../../api/EndUserApi/endUserOrders/_requests";

export const useAllOrdersPaginate = (page: number) => {
  return useQuery({
    queryKey: ["EndUserOrders", page],
    queryFn: async () => {
      const response = await getOrdersWithPaginate({
        page: page + 1,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 4,
  });
};

export const useGetOrderById = (id?: number | string) => {
  return useQuery({
    queryKey: ["endUserOrder", id],
    queryFn: () => getOrderById(id!),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      return await cancelOrder(id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["EndUserOrders"] });
      queryClient.invalidateQueries({ queryKey: ["EndUserOrders", "all"] });
      queryClient.invalidateQueries({ queryKey: ["endUserOrder", variables] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
