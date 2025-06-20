import axiosForm from "../../axiosInstanceFormData";
import axiosJson from "../../axiosInstanceJson";

export const getAllAdminsPaginate = async (params: {
  page?: number;
  name?: string;
  email?: string;
  phone?: string;
}) => {
  return await axiosJson.get("/api/vendor/admins/withPaginate", {
    params,
  });
};
export const getAdminById = async (id: number | string) => {
  return await axiosJson.get(`/api/vendor/admins/${id}`);
};

export const deleteAdmin = async (id: number | string) => {
  return await axiosJson.delete(`/api/vendor/admins/${id}`);
};

export const getAllRoles = async () => {
  return await axiosJson.get("/api/vendor/roles");
};

export const createAdmin = async (adminData: any) => {
  return await axiosJson.post(`/api/vendor/admins`, adminData);
};

export const updateAdmin = async (id: number | string, adminData: any) => {
  return await axiosForm.post(`/api/vendor/admins/${id}`, adminData);
};
