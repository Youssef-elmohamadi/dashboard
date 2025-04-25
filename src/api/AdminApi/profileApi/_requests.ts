import axiosJson from "../../axiosInstanceJson";

export const showUser = async (id: number) => {
  return await axiosJson.get(`/api/vendor/admins/${id}`);
};
