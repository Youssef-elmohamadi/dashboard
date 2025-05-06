import axiosJson from "../../superAdminAxiosInstanceJson";

export const getAllRoles = async () => {
  return await axiosJson.get("/api/superAdmin/roles");
};
export const getRoleById = async (id: any) => {
  return await axiosJson.get(`/api/superAdmin/roles/${id}`);
};
export const getAllRolesPaginate = async (params: {
  pageIndex: number | undefined;
  pageSize?: number | undefined;
  name?: string;
}) => {
  return await axiosJson.get("/api/superAdmin/roles/paginate", {
    params,
  });
};
export const getAllPermissions = async () => {
  return await axiosJson.get("/api/superAdmin/permissions");
};
export const updateRole = async (updateData: any, id: number) => {
  return await axiosJson.put(`/api/superAdmin/roles/${id}`, updateData);
};
export const createRole = async (data: any) => {
  return await axiosJson.post(`/api/superAdmin/roles`, data);
};

export const deleteRole = async (id: number) => {
  return await axiosJson.delete(`/api/superAdmin/roles/${id}`);
};
