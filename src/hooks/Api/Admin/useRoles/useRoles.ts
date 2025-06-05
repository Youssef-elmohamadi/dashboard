import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRole,
  deleteRole,
  getAllPermissions,
  getAllRoles,
  getAllRolesPaginate,
  getRoleById,
  updateRole,
} from "../../../../api/AdminApi/rolesApi/_requests";
import { AxiosError } from "axios";

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles", "all"],
    queryFn: getAllRoles,
    staleTime: 1000 * 60 * 4,
  });
};

export const useRolesPaginate = (page: number, filters?: any) => {
  return useQuery({
    queryKey: ["roles", page, filters],
    queryFn: async () => {
      const response = await getAllRolesPaginate({
        page: page + 1,
        ...filters,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 4,
    onError: (error: AxiosError) => {
      console.error("حدث خطاء في جلب الصلاحيات:", error);
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      return await deleteRole(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetAllPermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      return await getAllPermissions();
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roleData: any) => {
      return await createRole(roleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetRoleById = (id?: string) => {
  return useQuery({
    queryKey: ["role", id],
    queryFn: () => getRoleById(id!),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useUpdateRole = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roleData, id }: { roleData: any; id: number }) => {
      return await updateRole(roleData, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles", "all"] });
      queryClient.invalidateQueries({ queryKey: ["role", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
