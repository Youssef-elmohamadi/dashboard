import axiosJson from "../axiosInstanceJson";
import axiosForm from "../axiosInstanceFormData";
export const getAllProducts = async () => {
  return await axiosJson.get("/api/vendor/products");
};

export const showProduct = async (id: number) => {
  return await axiosJson.get(`/api/vendor/products/${id}`);
};

export const deleteProduct = async (id: number) => {
  return await axiosJson.delete(`/api/vendor/products/${id}`);
};

export const createProduct = async (productData: any) => {
  return await axiosForm.post(`/api/vendor/products`, productData);
};

export const updateProduct = async (productData: any, id: number) => {
  return await axiosForm.post(`/api/vendor/products/${id}`, productData);
};
