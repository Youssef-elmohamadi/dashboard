import axiosJson from "../../superAdminAxiosInstanceJson";
import axiosForm from "../../superAdminAxiosInstanceFormData";
export const getAllCategories = async () => {
  return await axiosJson.get("/api/superAdmin/categories");
};

export const getCategoriesPaginate = async (params: {
  pageIndex: number | undefined;
  pageSize?: number | undefined;
  status?: string;
  category_id?: number;
  brand_id?: number;
}) => {
  return await axiosJson.get("/api/superAdmin/categories/withPaginate", {
    params,
  });
};

export const getCategoryById = async (id: number | string) => {
  return await axiosJson.get(`/api/superAdmin/categories/${id}`);
};

export const deleteCategory = async (id: number) => {
  return await axiosJson.delete(`/api/superAdmin/categories/${id}`);
};

export const createCategory = async (productData: any) => {
  return await axiosForm.post(`/api/superAdmin/categories`, productData);
};

export const updateCategory = async (productData: any, id: number) => {
  return await axiosForm.post(`/api/superAdmin/categories/${id}`, productData);
};
