import axiosForm from "../../axiosInstanceFormData";
import axiosJson from "../../axiosInstanceJson";

export const getAllCategories = async () => {
    return await axiosJson.get("/api/user/categories");
  };
