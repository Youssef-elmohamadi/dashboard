import axiosJson from "../../axiosInstanceJson";
import axiosForm from "../../axiosInstanceFormData";
import {
  AllCategoriesData,
  CategoryParams,
  GetCategoriesApiResponse,
  PaginatedCategoriesData,
} from "../../../types/Categories";
export const getCategoriesPaginate = async (params: CategoryParams) => {
  return await axiosJson.get<GetCategoriesApiResponse<PaginatedCategoriesData>>(
    "/api/superAdmin/categories/withPaginate",
    {
      params,
    }
  );
};

export const getAllCategories = async () => {
  return await axiosJson.get<GetCategoriesApiResponse<AllCategoriesData>>(
    "/api/superAdmin/categories"
  );
};
