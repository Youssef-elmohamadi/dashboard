import axiosForm from "../../superAdminAxiosInstanceFormData";
import axiosJson from "../../superAdminAxiosInstanceJson";

export const getAllAdminsPaginate = async (params: {
  page?: number;
  name?: string;
  email?: string;
  phone?: string;
}) => {
  return await axiosJson.get("/api/superAdmin/admins/paginate", {
    params,
  });
};
export const getAdminById = async (id: string | number) => {
  return await axiosJson.get(`/api/superAdmin/admins/${id}`);
};

export const deleteAdmin = async (id: number | string) => {
  return await axiosJson.delete(`/api/superAdmin/admins/${id}`);
};

export const getAllRoles = async () => {
  return await axiosJson.get("/api/superAdmin/roles");
};

export const createAdmin = async (adminData: any) => {
  return await axiosForm.post(`/api/superAdmin/admins`, adminData);
};

export const updateAdmin = async (id: number | string, adminData: any) => {
  return await axiosForm.post(`/api/superAdmin/admins/${id}`, adminData);
};
