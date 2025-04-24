import axiosForm from "../../axiosInstanceFormData";
import axiosJson from "../../userAxiosInstanceEndUser";

export const getAllCategories = async () => {
  return await axiosJson.get("/api/user/categories", {
    cache: {
      ttl: 1000 * 60 * 5,
      interpretHeader: false,
    },
  });
};
