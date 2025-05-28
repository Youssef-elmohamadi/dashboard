import { useQuery } from "@tanstack/react-query";
import { productsReport } from "../api/AdminApi/productsReportApi/_requests";

export const useProductData = (filters: any) => {
  return useQuery({
    queryKey: ["productsReport", filters],
    queryFn: async () => {
      const response = await productsReport({
        ...filters,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
