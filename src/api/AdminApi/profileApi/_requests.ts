import axiosJson from "../../axiosInstanceJson";
import axiosForm from "../../axiosInstanceFormData";
export const getAdminUser = async (id: number | string) => {
  return await axiosJson.get(`/api/vendor/admins/${id}`);
};

export const updateAdminUserData = async ({
  id,
  adminData,
}: {
  id: string;
  adminData: any;
}) => {
  const response = await axiosForm.post(`/api/vendor/admins/${id}`, adminData);
  return response.data;
};
