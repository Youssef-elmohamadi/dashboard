import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllRoles,
  getRoleById,
  getAllRolesPaginate,
  getAllPermissions,
  updateRole,
  createRole,
  deleteRole,
} from "../../../../api/SuperAdminApi/Roles/_requests";
import {
  CreateRoleInput,
  FilterRole,
  Permission,
  Role,
  RolesPaginate,
  UpdateRoleInput,
} from "../../../../types/Roles";

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles", "all"],
    queryFn: getAllRoles,
    staleTime: 1000 * 60 * 4,
  });
};

export const useRolesPaginate = (page: number, filters?: FilterRole) => {
  return useQuery<RolesPaginate>({
    queryKey: ["roles", page, filters],
    queryFn: async () => {
      const response = await getAllRolesPaginate(page, filters);

      return response.data.data;
    },
    staleTime: 1000 * 60 * 4,
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
  return useQuery<Permission[]>({
    queryKey: ["permissions"],
    queryFn: async () => {
      const response = await getAllPermissions();

      return response.data.data;
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roleData: CreateRoleInput) => {
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

export const useGetRoleById = (id?: number | string) => {
  return useQuery<Role>({
    queryKey: ["role", id],
    queryFn: async () => {
      const response = await getRoleById(id);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useUpdateRole = (id: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roleData,
      id,
    }: {
      roleData: UpdateRoleInput;
      id: number;
    }) => {
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
