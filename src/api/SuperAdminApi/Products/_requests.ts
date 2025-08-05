import SuperAdminAxiosInstanceJson from "../../superAdminAxiosInstanceJson";
export const getProductsWithPaginate = async (params: {
  page?: number;
  name?: string;
  email?: string;
  phone?: string;
}) => {
  return await SuperAdminAxiosInstanceJson.get(
    "/api/superAdmin/products/paginate",
    {
      params,
    }
  );
};

export const changeStatus = async (id, data) => {
  return await SuperAdminAxiosInstanceJson.post(
    `/api/superAdmin/products/changeStatus/${id}`,
    data
  );
};
export const getProductById = async (id) => {
  return await SuperAdminAxiosInstanceJson.get(
    `/api/superAdmin/products/${id}`
  );
};
export const shipmentOrder = async (data, id) => {
  return await SuperAdminAxiosInstanceJson.post(
    `/api/vendor/orders/ship/${id}`,
    data
  );
};

export const cancelOrder = async (id) => {
  return await SuperAdminAxiosInstanceJson.get(
    `/api/vendor/orders/cancel/${id}`
  );
};
