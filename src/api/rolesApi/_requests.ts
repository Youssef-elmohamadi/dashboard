import axiosJson from "../axiosInstanceJson";

export const getAllRoles = async () => {
  return await axiosJson.get("/api/vendor/roles");
};
export const getAllPermissions = async () => {
  return await axiosJson.get("/api/vendor/permissions");
};
export const updateRole = async (updateData: any, id: number) => {
  return await axiosJson.put(`/api/vendor/roles/${id}`, updateData);
};
export const createRole = async (data: any) => {
  return await axiosJson.post(`/api/vendor/roles`, data);
};
