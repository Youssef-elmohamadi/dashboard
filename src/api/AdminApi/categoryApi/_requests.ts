import axiosJson from "../../axiosInstanceJson";
import axiosForm from "../../axiosInstanceFormData";
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

export const getAllCategories = async () => {
  return await axiosJson.get("/api/superAdmin/categories");
};

export const showProduct = async (id: number) => {
  return await axiosJson.get(`/api/vendor/products/${id}`);
};

export const deleteProduct = async (id: number) => {
  return await axiosJson.delete(`/api/vendor/products/${id}`);
};

export const createProduct = async (adminData: any) => {
  return await axiosForm.post(`/api/vendor/products`, adminData);
};

export const updateAdmin = async (id: number, adminData: any) => {
  return await axiosJson.put(`/api/vendor/admins/${id}`, adminData);
};
