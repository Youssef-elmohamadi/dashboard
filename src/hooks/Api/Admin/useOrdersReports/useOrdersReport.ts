import { useQuery } from "@tanstack/react-query";
import { ordersReport } from "../../../../api/AdminApi/ordersReports/_requests";

export const useOrderData = (filters: any) => {
  return useQuery({
    queryKey: ["ordersReport", filters],
    queryFn: async () => {
      const response = await ordersReport({
        ...filters,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
