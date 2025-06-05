import axiosJson from "../../superAdminAxiosInstanceJson";
import axiosForm from "../../superAdminAxiosInstanceFormData";

export const getBannersPaginate = async (params: {
  pageIndex: number | undefined;
  pageSize?: number | undefined;
  status?: string;
  category_id?: number;
  brand_id?: number;
}) => {
  return await axiosJson.get("/api/superAdmin/banners/paginate", {
    params,
  });
};

export const getBannerById = async (id: number | string) => {
  return await axiosJson.get(`/api/superAdmin/banners/${id}`);
};

export const deleteBanner = async (id: number | string) => {
  return await axiosJson.delete(`/api/superAdmin/banners/${id}`);
};

export const createBanner = async (categoryData: any) => {
  return await axiosForm.post(`/api/superAdmin/banners`, categoryData);
};

export const updateBanner = async (categoryData: any, id: number) => {
  return await axiosForm.post(`/api/superAdmin/banners/${id}`, categoryData);
};
