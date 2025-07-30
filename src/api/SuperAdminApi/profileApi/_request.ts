import axiosJson from "../../superAdminAxiosInstanceJson";
import axiosInstanceFormData from "../../superAdminAxiosInstanceFormData";
export const getSuperAdminProfile = async () => {
  return await axiosJson.get(`/api/superAdmin/profile`);
};

export const updateSuperAdminProfileData = async (Data: any) => {
  return await axiosInstanceFormData.post(
    `/api/superAdmin/profile/update`,
    Data
  );
};
