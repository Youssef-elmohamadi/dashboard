import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelOrder,
  getOrderById,
  getOrdersWithPaginate,
  shipmentOrder,
} from "../../../../api/SuperAdminApi/ordersApi/_requests";
import {
  Order,
  OrderFilters,
  PaginatedOrdersData,
} from "../../../../types/Orders";

export const useAllOrdersPaginate = (page: number, filters?: OrderFilters) => {
  return useQuery<PaginatedOrdersData>({
    queryKey: ["orders", page, filters],
    queryFn: async () => {
      const response = await getOrdersWithPaginate({
        page: page + 1,
        ...filters,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 4,
  });
};

export const useGetOrderById = (id?: number | string) => {
  return useQuery<Order>({
    queryKey: ["order", id],
    queryFn: async () => {
      const response = await getOrderById(id!);
      return response.data.data;
    },
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
      const id = variables;
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "all"] });
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
export const useShipOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, id }: { data: any; id: number }) => {
      return await shipmentOrder(data, id);
    },
    onSuccess: (_, variables) => {
      const { id } = variables;
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "all"] });
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
