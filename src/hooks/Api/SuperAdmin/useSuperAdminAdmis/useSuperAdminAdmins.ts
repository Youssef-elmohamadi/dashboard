import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdmin,
  deleteAdmin,
  getAdminById,
  getAllAdminsPaginate,
  updateAdmin,
} from "../../../../api/SuperAdminApi/Admins/_requests";
import { AxiosError } from "axios";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type PaginatedResponse<T> = {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
};
type Admin = {
  id: number;
  name: string;
  email: string;
  phone: string;
  roles: string[];
  created_at: string;
};

type AdminFilters = {
  name?: string;
  email?: string;
  phone?: string;
};

type CreateAdminInput = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  role: string;
};
type UpdateAdminInput = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  role: string;
};

export const useAllAdmins = (page: number, filters?: AdminFilters) => {
  return useQuery<PaginatedResponse<Admin>>({
    queryKey: ["superAdminAdmins", page, filters],
    queryFn: async () => {
      const response = await getAllAdminsPaginate({
        page: page + 1,
        ...filters,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 4,
    onError: (error: AxiosError) => {
      console.error("حدث خطأ أثناء جلب المشرفين:", error);
    },
  });
};

export const useGetAdminById = (id?: number | string) => {
  return useQuery<ApiResponse<PaginatedResponse<Admin>>, Error>({
    queryKey: ["admin", id],
    queryFn: () => getAdminById(id!),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      return await deleteAdmin(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superAdminAdmins"] });
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
      queryClient.invalidateQueries({ queryKey: ["superAdminAdmins"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateAdmin = (id: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      adminData,
    }: {
      id: number;
      adminData: UpdateAdminInput;
    }) => {
      return await updateAdmin(id, adminData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superAdminAdmins"] });
      queryClient.invalidateQueries({ queryKey: ["superAdmin", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
