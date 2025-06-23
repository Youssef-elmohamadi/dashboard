import { AdminFilters, ApiResponse } from "../../../types/Admins";
import { ID } from "../../../types/Common";
import axiosForm from "../../axiosInstanceFormData";
import axiosJson from "../../axiosInstanceJson";

export const getAllAdminsPaginate = async (params: AdminFilters) => {
  return await axiosJson.get<ApiResponse>("/api/vendor/admins/withPaginate", {
    params,
  });
};
export const getAdminById = async (id: string) => {
  return await axiosJson.get(`/api/vendor/admins/${id}`);
};

export const deleteAdmin = async (id: ID) => {
  return await axiosJson.delete(`/api/vendor/admins/${id}`);
};

export const getAllRoles = async () => {
  return await axiosJson.get("/api/vendor/roles");
};

export const createAdmin = async (adminData: any) => {
  return await axiosJson.post(`/api/vendor/admins`, adminData);
};

export const updateAdmin = async (id: string, adminData: any) => {
  return await axiosForm.post(`/api/vendor/admins/${id}`, adminData);
};
