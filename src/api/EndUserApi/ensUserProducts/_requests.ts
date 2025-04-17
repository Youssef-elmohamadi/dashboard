import axiosForm from "../../axiosInstanceFormData";
import axiosJson from "../../axiosInstanceJson";

export const getProductCategories = async () => {
  return await axiosJson.get("/api/user/products/productCategories");
};
