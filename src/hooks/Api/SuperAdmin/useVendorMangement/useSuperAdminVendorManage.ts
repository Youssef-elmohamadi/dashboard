import { AxiosError } from "axios";
import {
  getVendorById,
  getVendorsWithPaginate,
  changeDocumentStatus,
  changeStatus,
} from "../../../../api/SuperAdminApi/Vendors/_requests";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Vendor, VendorsPaginate } from "../../../../types/Vendor";
//import { changeStatus } from "../api/SuperAdminApi/Products/_requests";

export const useGetVendorsPaginate = (page: number, filters?: any) => {
  return useQuery<VendorsPaginate>({
    queryKey: ["vendors", page, filters],
    queryFn: async () => {
      const response = await getVendorsWithPaginate({
        page: page + 1,
        ...filters,
      });
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetVendorById = (id: number | string) => {
  return useQuery<Vendor>({
    queryKey: ["vendor", id],
    queryFn: async () => {
      const response = await getVendorById(id!);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useChangeVendorStatus = () => {
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
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useChangeDocumentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { status: string };
    }) => {
      return await changeDocumentStatus(id, data);
    },
    onSuccess: (_, variables) => {
      const { id } = variables;
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
