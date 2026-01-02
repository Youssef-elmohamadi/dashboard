import axiosJson from "../../userAxiosInstanceEndUser";
export const getBlogs = async () => {
  const response = await axiosJson.get("/api/user/articles/withPaginate", {
    params: {
      page: 1,
    },
  });
  return response.data.data;
};

export const getBlogById = async (id: string) => {
  const response = await axiosJson.get(`/api/user/articles/${id}`);
  return response.data;
};
