import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdmin,
  deleteAdmin,
  getAdminById,
  getAllAdminsPaginate,
  updateAdmin,
} from "../../../../api/AdminApi/usersApi/_requests";
import {
  Admin,
  AdminFilters,
  AdminsPaginate,
  CreateAdminInput,
  UpdateAdminArguments,
} from "../../../../types/Admins";
import { ID } from "../../../../types/Common";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const useAllAdmins = (page: number, filters?: AdminFilters) => {
  return useQuery<AdminsPaginate>({
    queryKey: ["vendorAdmins", page, filters],
    queryFn: async () => {
      const response = await getAllAdminsPaginate({
        page: page + 1,
        ...filters,
      });
      return response.data.data;
    },
    staleTime: 1000 * 60 * 4,
  });
};

export const useGetAdminById = (id?: ID) => {
  return useQuery<Admin>({
    queryKey: ["admin", id],
    queryFn: async () => {
      const response = await getAdminById(id!);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: ID) => {
      return await deleteAdmin(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorAdmins"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (adminData: CreateAdminInput) => {
      return await createAdmin(adminData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorAdmins"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateAdmin = (id: ID) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, adminData }: UpdateAdminArguments) => {
      return await updateAdmin(id, adminData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorAdmins"] });
      queryClient.invalidateQueries({ queryKey: ["admin", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
