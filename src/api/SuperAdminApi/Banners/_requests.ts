import axiosJson from "../../superAdminAxiosInstanceJson";
import axiosForm from "../../superAdminAxiosInstanceFormData";
import { BannerInput } from "../../../types/Banners";

export const getBannersPaginate = async (params: {
  page: number | undefined;
  name?: string;
  status?: string;
  category_id?: number | string;
  brand_id?: number | string;
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

export const createBanner = async (bannerData: BannerInput) => {
  return await axiosForm.post(`/api/superAdmin/banners`, bannerData);
};

export const updateBanner = async (bannerData: BannerInput, id: number) => {
  return await axiosForm.post(`/api/superAdmin/banners/${id}`, bannerData);
};
