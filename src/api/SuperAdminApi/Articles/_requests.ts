import axiosJson from "../../superAdminAxiosInstanceJson";
import axiosForm from "../../superAdminAxiosInstanceFormData";

export const getArticlesPaginate = async (params: {
  page: number | undefined;
  name?: string;
}) => {
  return await axiosJson.get("/api/superAdmin/articles/withPaginate", {
    params,
  });
};

export const getArticleById = async (id: number | string) => {
  return await axiosJson.get(`/api/superAdmin/articles/${id}`);
};

export const deleteArticle = async (id: number | string) => {
  return await axiosJson.delete(`/api/superAdmin/articles/${id}`);
};

export const createArticle = async (articleData: any) => {
  return await axiosForm.post(`/api/superAdmin/articles`, articleData);
};

export const updateArticle = async (articleData: any, id: number) => {
  return await axiosForm.post(`/api/superAdmin/articles/${id}`, articleData);
};
