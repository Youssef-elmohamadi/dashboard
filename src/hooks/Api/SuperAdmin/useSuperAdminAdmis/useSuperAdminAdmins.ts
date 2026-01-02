import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdmin,
  deleteAdmin,
  getAdminById,
  getAllAdminsPaginate,
  updateAdmin,
} from "../../../../api/SuperAdminApi/Admins/_requests";
import {
  Admin,
  AdminFilters,
  AdminsPaginate,
  CreateAdminInput,
  UpdateAdminInput,
} from "../../../../types/Admins";

export const useAllAdmins = (page: string | number, filters?: AdminFilters) => {
  return useQuery<AdminsPaginate>({
    queryKey: ["superAdminAdmins", page, filters],
    queryFn: async () => {
      const response = await getAllAdminsPaginate({
        page,
        ...filters,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 4,
  });
};

export const useGetAdminById = (id?: number | string) => {
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
