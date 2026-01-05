import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductsPaginate } from "../../../../types/Product";
import { changeStatus, getRequestById, getRequestsQuotationPaginate, getRequestsStastics } from "../../../../api/SuperAdminApi/RequestQuotation/_requests";

export const useGetRequestsQuotationPaginate = (page: number, filters?: any) => {
  return useQuery<ProductsPaginate>({
    queryKey: ["superAdminRequestsQuotation", page, filters],
    queryFn: async () => {
      const response = await getRequestsQuotationPaginate({
        page: page + 1,
        ...filters,
      });
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetRequestById = (id: number | string) => {
  return useQuery({
    queryKey: ["RequestQuotation", id],
    queryFn: () => getRequestById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useChangeRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { status: string };
    }) => {
      return await changeStatus(id, data);
    },
    onSuccess: (_, variables) => {
      const { id } = variables;
      queryClient.invalidateQueries({ queryKey: ["superAdminRequestsQuotation"] });
      queryClient.invalidateQueries({ queryKey: ["RequestQuotation", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetRequestsStastics = () => {
  return useQuery({
    queryKey: ["RequestsQuotationStastics"],
    queryFn: () => getRequestsStastics(),
    staleTime: 1000 * 60 * 5,
  });
};