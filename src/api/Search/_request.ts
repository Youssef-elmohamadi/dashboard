import axiosJson from "../userAxiosInstanceEndUser";

export const generalSearch = async (keyword: string, userType: string) => {
  try {
    const response = await axiosJson.get(
      `/api/general/search/${encodeURIComponent(keyword)}/${userType}`
    );
    return response.data;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
};
