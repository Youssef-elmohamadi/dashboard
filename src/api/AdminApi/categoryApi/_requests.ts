import axiosJson from "../../axiosInstanceJson";
import axiosForm from "../../axiosInstanceFormData";
import {
  CategoryParams,
  GetCategoriesApiResponse,
} from "../../../types/Categories";
export const getCategoriesPaginate = async (params: CategoryParams) => {
  return await axiosJson.get<GetCategoriesApiResponse>(
    "/api/superAdmin/categories/withPaginate",
    {
      params,
    }
  );
};

export const getAllCategories = async () => {
  return await axiosJson.get<GetCategoriesApiResponse>(
    "/api/superAdmin/categories"
  );
};
