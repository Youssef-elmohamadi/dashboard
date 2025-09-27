import axiosJson from "../../userAxiosInstanceEndUser";
export const getAllBrands = async () => {
  return await axiosJson.get("/api/user/brands", {
    cache: {
      ttl: 1000 * 60 * 5,
      interpretHeader: false,
    },
  });
};