import axiosJson from "../../superAdminAxiosInstanceJson";
import axiosForm from "../../superAdminAxiosInstanceFormData";
import {  CategoryParams } from "../../../types/Categories";
export const getAllCategories = async () => {
  return await axiosJson.get("/api/superAdmin/categories");
};

export const getCategoriesPaginate = async (params: CategoryParams) => {
  return await axiosJson.get("/api/superAdmin/categories/withPaginate", {
    params,
  });
};

export const getCategoryById = async (id: number | string) => {
  return await axiosJson.get(`/api/superAdmin/categories/${id}`);
};

export const deleteCategory = async (id: number | string) => {
  return await axiosJson.delete(`/api/superAdmin/categories/${id}`);
};

export const createCategory = async (categoryData: FormData) => {
  return await axiosForm.post(`/api/superAdmin/categories`, categoryData);
};

export const updateCategory = async (
  categoryData: FormData,
  id: number | string
) => {
  return await axiosForm.post(`/api/superAdmin/categories/${id}`, categoryData);
};
