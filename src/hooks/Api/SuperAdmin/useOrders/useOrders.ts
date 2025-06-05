import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelOrder,
  getOrderById,
  getOrdersWithPaginate,
  shipmentOrder,
} from "../../../../api/SuperAdminApi/ordersApi/_requests";
import { AxiosError } from "axios";

type OrderFilters = {
  status?: string;
  shipping_status?: string;
  tracking_number?: string;
  from_date?: string;
  to_date?: string;
};
export const useAllOrdersPaginate = (page: number, filters?: OrderFilters) => {
  return useQuery({
    queryKey: ["orders", page, filters],
    queryFn: async () => {
      const response = await getOrdersWithPaginate({
        page: page + 1,
        ...filters,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 4,
    onError: (error: AxiosError) => {
      console.error("حدث خطأ أثناء جلب الطلبات:", error);
    },
  });
};

export const useGetOrderById = (id?: number | string) => {
  return useQuery({
    queryKey: ["order", id],
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
