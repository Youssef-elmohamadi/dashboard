import axiosJson from "../../axiosInstanceJson";
import axiosForm from "../../axiosInstanceFormData";
export const getBrandsPaginate = async (params: {
  page: number | undefined;
  pageSize?: number | undefined;
  name?: string;
}) => {
  return await axiosJson.get("/api/vendor/brands/withPaginate", {
    params,
  });
};
export const getAllBrands = async () => {
  return await axiosJson.get("/api/vendor/brands");
};
export const getBrandById = async (id: any) => {
  return await axiosJson.get(`/api/vendor/brands/${id}`);
};

export const deleteBrand = async (id: number) => {
  return await axiosJson.delete(`/api/vendor/brands/${id}`);
};

export const updateBrand = async (updateData: any, id: number) => {
  return await axiosForm.post(`/api/vendor/brands/${id}`, updateData);
};
export const createBrand = async (data: any) => {
  return await axiosForm.post(`/api/vendor/brands`, data);
};
