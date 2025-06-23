import { ID } from "../../../types/Common";
import axiosJson from "../../axiosInstanceJson";

export const getAllRoles = async () => {
  return await axiosJson.get("/api/vendor/roles");
};
export const getRoleById = async (id: any) => {
  return await axiosJson.get(`/api/vendor/roles/${id}`);
};
export const getAllRolesPaginate = async (params: {
  page?: number | undefined;
  name?: string;
}) => {
  return await axiosJson.get("/api/vendor/roles/withPaginate", {
    params,
  });
};
export const getAllPermissions = async () => {
  return await axiosJson.get("/api/vendor/permissions");
};
export const updateRole = async (updateData: any, id: string) => {
  return await axiosJson.put(`/api/vendor/roles/${id}`, updateData);
};
export const createRole = async (data: any) => {
  return await axiosJson.post(`/api/vendor/roles`, data);
};

export const deleteRole = async (id: ID) => {
  return await axiosJson.delete(`/api/vendor/roles/${id}`);
};
