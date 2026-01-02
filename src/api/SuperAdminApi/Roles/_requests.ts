import {
  CreateRoleInput,
  FilterRole,
  UpdateRoleInput,
} from "../../../types/Roles";
import axiosJson from "../../superAdminAxiosInstanceJson";

export const getAllRoles = async () => {
  return await axiosJson.get("/api/superAdmin/roles");
};
export const getRoleById = async (id: any) => {
  return await axiosJson.get(`/api/superAdmin/roles/${id}`);
};
export const getAllRolesPaginate = async (
  page: number,
  filters?: FilterRole
) => {
  return await axiosJson.get("/api/superAdmin/roles/paginate", {
    params: {
      page,
      ...filters,
    },
  });
};
export const getAllPermissions = async () => {
  return await axiosJson.get("/api/superAdmin/permissions");
};
export const updateRole = async (
  updateData: UpdateRoleInput,
  id: number | string
) => {
  return await axiosJson.put(`/api/superAdmin/roles/${id}`, updateData);
};
export const createRole = async (data: CreateRoleInput) => {
  return await axiosJson.post(`/api/superAdmin/roles`, data);
};

export const deleteRole = async (id: number | string) => {
  return await axiosJson.delete(`/api/superAdmin/roles/${id}`);
};
