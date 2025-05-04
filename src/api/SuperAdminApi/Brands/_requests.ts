import axiosForm from "../../axiosInstanceFormData";
import SuperAdminAxiosInstanceJson from "../../superAdminAxiosInstanceJson";
export const getBrandsWithPaginate = async (params: {
  page?: number;
  name?: string;
  email?: string;
  phone?: string;
}) => {
  return await SuperAdminAxiosInstanceJson.get(
    "/api/superAdmin/brands/withPaginate",
    {
      params,
    }
  );
};
export const getBrandById = async (id) => {
  return await SuperAdminAxiosInstanceJson.get(`/api/superAdmin/brands/${id}`);
};
export const changeStatus = async (id, data) => {
  return await SuperAdminAxiosInstanceJson.post(
    `/api/superAdmin/brands/changeStatus/${id}`,
    data
  );
};

export const cancelOrder = async (id) => {
  return await SuperAdminAxiosInstanceJson.get(
    `/api/vendor/orders/cancel/${id}`
  );
};
