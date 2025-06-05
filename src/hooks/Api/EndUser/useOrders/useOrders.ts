import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    cancelOrder,
  getOrderById,
  getOrdersWithPaginate,
} from "../../../../api/EndUserApi/endUserOrders/_requests";
import { AxiosError } from "axios";

export const useAllOrdersPaginate = (page: number) => {
  return useQuery({
    queryKey: ["EndUsersOrders", page],
    queryFn: async () => {
      const response = await getOrdersWithPaginate({
        page: page + 1,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 4,
    onError: (error: AxiosError) => {
      console.error("حدث خطأ أثناء جلب المشرفين:", error);
    },
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
      const { id } = variables;
      queryClient.invalidateQueries({ queryKey: ["EndUsersOrders"] });
      queryClient.invalidateQueries({ queryKey: ["EndUsersOrders", "all"] });
      queryClient.invalidateQueries({ queryKey: ["endUserOrder", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
