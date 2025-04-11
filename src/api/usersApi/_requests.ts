import axiosJson from "../axiosInstanceJson";

export const getAllAdmins = async () => {
  return await axiosJson.get("/api/vendor/admins");
};

export const deleteAdmin = async (id: number) => {
  return await axiosJson.delete(`/api/vendor/admins/${id}`);
};

export const getAllRoles = async () => {
  return await axiosJson.get("/api/vendor/roles");
};

export const createAdmin = async (adminData: any) => {
  return await axiosJson.post(`/api/vendor/admins`, adminData);
};

export const updateAdmin = async (id: number, adminData: any) => {
  return await axiosJson.put(`/api/vendor/admins/${id}`, adminData);
};