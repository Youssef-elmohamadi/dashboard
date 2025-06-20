import axiosJson from "../../axiosInstanceJson";
import axiosForm from "../../axiosInstanceFormData";
import {
  BrandParams,
  GetBrandsPaginateApiResponse,
  UpdateBrand,
} from "../../../types/Brands";
import { ID } from "../../../types/Common";

export const getBrandsPaginate = async (params: BrandParams) => {
  return await axiosJson.get<GetBrandsPaginateApiResponse>(
    "/api/vendor/brands/withPaginate",
    {
      params,
    }
  );
};
export const getAllBrands = async () => {
  return await axiosJson.get("/api/vendor/brands");
};
export const getBrandById = async (id: string | undefined) => {
  return await axiosJson.get(`/api/vendor/brands/${id}`);
};

export const deleteBrand = async (id: ID) => {
  return await axiosJson.delete(`/api/vendor/brands/${id}`);
};

export const updateBrand = async (
  updateData: FormData,
  id: string | undefined
) => {
  return await axiosForm.post(`/api/vendor/brands/${id}`, updateData);
};
export const createBrand = async (data: FormData) => {
  return await axiosForm.post(`/api/vendor/brands`, data);
};
