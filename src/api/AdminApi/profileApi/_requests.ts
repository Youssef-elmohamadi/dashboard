import axiosJson from "../../axiosInstanceJson";

export const showUser = async (id: number | string) => {
  return await axiosJson.get(`/api/vendor/admins/${id}`);
};
