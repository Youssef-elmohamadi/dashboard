import axiosForm from "../../axiosInstanceFormData";
import axiosJson from "../../axiosInstanceJson";
export const getVendor = async () => {
  return await axiosJson.get("/api/vendor/vendor");
};
export const updateVendor = async (data: any) => {
  return await axiosForm.post("/api/vendor/vendor", data);
};
