import axiosJson from "../../superAdminAxiosInstanceJson";
import axiosFormData from "../../axiosInstanceFormData";
const SuperAdminHomeData = async () => {
  return await axiosJson.get("/api/superAdmin/home");
};

export { SuperAdminHomeData };
