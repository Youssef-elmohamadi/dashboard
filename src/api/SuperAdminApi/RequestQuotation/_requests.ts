import SuperAdminAxiosInstanceJson from "../../superAdminAxiosInstanceJson";
export const getRequestsQuotationPaginate = async (params: {
  page?: number;
}) => {
  return await SuperAdminAxiosInstanceJson.get(
    "api/superAdmin/rfq/paginate",
    {
      params,
    }
  );
};

export const changeStatus = async (id, data) => {
  return await SuperAdminAxiosInstanceJson.post(
    `/api/superAdmin/rfq/updateStatus/${id}`,
    data
  );
};
export const getRequestById = async (id) => {
  return await SuperAdminAxiosInstanceJson.get(
    `/api/superAdmin/rfq/${id}`
  );
};
export const getRequestsStastics = async () => {
  return await SuperAdminAxiosInstanceJson.get(
    `/api/superAdmin/rfq/statistics`
  );
};
