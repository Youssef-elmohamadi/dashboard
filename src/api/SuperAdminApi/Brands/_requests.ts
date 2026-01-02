import axiosForm from "../../axiosInstanceFormData";
import SuperAdminAxiosInstanceJson from "../../superAdminAxiosInstanceJson";

export const getAllBrands = async () => {
  return await SuperAdminAxiosInstanceJson.get("/api/superAdmin/brands");
};
export const getBrandsWithPaginate = async (params: {
  page?: number;
  name?: string;
}) => {
  return await SuperAdminAxiosInstanceJson.get(
    "/api/superAdmin/brands/withPaginate",
    {
      params,
    }
  );
};
export const getBrandById = async (id: string | undefined) => {
  return await SuperAdminAxiosInstanceJson.get(`/api/superAdmin/brands/${id}`);
};
export const changeStatus = async (id: number | string, data: any) => {
  return await SuperAdminAxiosInstanceJson.post(
    `/api/superAdmin/brands/changeStatus/${id}`,
    data
  );
};
