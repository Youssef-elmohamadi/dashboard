import SuperAdminAxiosInstanceJson from "../../superAdminAxiosInstanceJson";
export const getVendorsWithPaginate = async (params: {
  page?: number;
  name?: string;
  email?: string;
  phone?: string;
}) => {
  return await SuperAdminAxiosInstanceJson.get(
    "/api/superAdmin/vendors/paginate",
    {
      params,
    }
  );
};

export const changeStatus = async (id, data) => {
  return await SuperAdminAxiosInstanceJson.post(
    `/api/superAdmin/vendors/approvedVendor/${id}`,
    data
  );
};
export const changeDocumentStatus = async (id, data) => {
  return await SuperAdminAxiosInstanceJson.post(
    `/api/superAdmin/vendors/changeDocumentStatus/${id}`,
    data
  );
};
export const getVendorById = async (id) => {
  return await SuperAdminAxiosInstanceJson.get(`/api/superAdmin/vendors/${id}`);
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
