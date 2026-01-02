import axiosJson from "../../axiosInstanceJson";
import {
  AllCategoriesData,
  CategoryParams,
  GetCategoriesApiResponse,
  PaginatedCategoriesData,
} from "../../../types/Categories";
export const getCategoriesPaginate = async (params: CategoryParams) => {
  return await axiosJson.get<GetCategoriesApiResponse<PaginatedCategoriesData>>(
    "/api/user/categories/withPaginate",
    {
      params,
    }
  );
};

export const getAllCategories = async () => {
  return await axiosJson.get<GetCategoriesApiResponse<AllCategoriesData>>(
    "/api/user/categories"
  );
};
