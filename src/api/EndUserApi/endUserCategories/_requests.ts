import axiosJson from "../../userAxiosInstanceEndUser";
import axios from "axios";

export const fetcher = (url: string) => axios.get(url).then(res => res.data.data);
export const getAllCategories = async () => {
  return await axiosJson.get("/api/user/categories", {
    cache: {
      ttl: 1000 * 60 * 5,
      interpretHeader: false,
    },
  });
};
