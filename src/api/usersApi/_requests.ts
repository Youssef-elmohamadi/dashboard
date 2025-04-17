import axiosForm from "../axiosInstanceFormData";
import axiosJson from "../axiosInstanceJson";

export const getAllAdmins = async (pageIndex: number, pageSize: number) => {
  return await axiosJson.get("/api/vendor/admins", {
    params: { page: pageIndex, per_page: pageSize },
  });
};
export const getAdminById = async (id: string) => {
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
