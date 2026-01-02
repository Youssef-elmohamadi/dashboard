import axiosJson from "../../axiosInstanceJson";
import axiosForm from "../../axiosInstanceFormData";
import { ID } from "../../../types/Common";
export const getAllProductQuestions = async () => {
  return await axiosJson.get("/api/vendor/product-questions");
};



export const getProductQuestionsPaginate = async (params: {
  page: number | undefined;
}) => {
  return await axiosJson.get("/api/vendor/product-questions/withPaginate", {
    params,
  });
};

export const showProductQuestion = async (id: number | string) => {
  return await axiosJson.get(`/api/vendor/product-questions/${id}`);
};

export const deleteProductQuestion = async (id: ID) => {
  return await axiosJson.delete(`/api/vendor/product-questions/${id}`);
};

export const createProductQuestion = async (productData: any) => {
  return await axiosForm.post(`/api/vendor/product-questions`, productData);
};

export const updateProductQuestion = async (productData: any, id: number) => {
  return await axiosForm.post(`/api/vendor/product-questions/${id}`, productData);
};


export const showAnswersByQuestion = async (id: number | string) => {
  return await axiosJson.get(`/api/vendor/product-question-answers/by-question/${id}`);
};
export const createAnswerToQuestion = async (answerData: any) => {
  return await axiosJson.post(`/api/vendor/product-question-answers`, answerData);
};

export const updateAnswerToQuestion = async (answerData: any, id: number) => {
  return await axiosForm.post(`/api/vendor/product-question-answers/${id}`, answerData);
};
export const deleteAnswerToQuestion = async (id: ID) => {
  return await axiosJson.delete(`/api/vendor/product-question-answers/${id}`);
}

export const getAllQuestions = async () => {
  return await axiosJson.get("/api/vendor/product-questions");
};

export const assignQuestionsToProduct = async (questionId: number, data: any) => {
  return await axiosJson.post(`/api/vendor/product-questions/${questionId}/assign-product`, data);
}

export const unassignQuestionsFromProduct = async (questionId: number, data: any) => {
  return await axiosJson.post(`/api/vendor/product-questions/${questionId}/remove-product`, data);
}