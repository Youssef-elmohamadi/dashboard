import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Product,
  ProductFilters,
  ProductsPaginate,
} from "../../../../types/Product";
import { ID } from "../../../../types/Common";
import { assignQuestionsToProduct, createAnswerToQuestion, createProductQuestion, deleteAnswerToQuestion, deleteProductQuestion, getAllQuestions, getProductQuestionsPaginate, showAnswersByQuestion, showProductQuestion, unassignQuestionsFromProduct, updateAnswerToQuestion, updateProductQuestion } from "../../../../api/AdminApi/questionApi/_requests";

export const useAllProductQuestions = (page: number, filters?: ProductFilters) => {
  return useQuery<ProductsPaginate>({
    queryKey: ["adminProductQuestions", page, filters],
    queryFn: async () => {
      const response = await getProductQuestionsPaginate({
        page: page + 1,
        ...filters,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 4,
  });
};

export const useDeleteProductQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: ID) => {
      return await deleteProductQuestion(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProductQuestions"] });
      //queryClient.invalidateQueries({ queryKey: ["products", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useCreateProductQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData: any) => {
      return await createProductQuestion(productData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProductQuestions"] });
      //queryClient.invalidateQueries({ queryKey: ["products", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetProductQuestionById = (id?: number | string) => {
  return useQuery<Product>({
    queryKey: ["productQuestion", id],
    queryFn: async () => {
      const response = await showProductQuestion(id!);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useUpdateProductQuestion = (id: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productData,
      id,
    }: {
      productData: any;
      id: number;
    }) => {
      return await updateProductQuestion(productData, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProductQuestions"] });
      queryClient.invalidateQueries({ queryKey: ["productQuestion", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useShowAnswersByQuestion = (id?: number | string) => {
  return useQuery<any>({
    queryKey: ["answerByQuestion", id],
    queryFn: async () => {
      const response = await showAnswersByQuestion(id!);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}


export const useCreateAnswerToQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (answerData: any) => {
      return await createAnswerToQuestion(answerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProductQuestions"] });
      //queryClient.invalidateQueries({ queryKey: ["products", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateAnswerToQuestion = (id: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      answerData,
      id,
    }: {
      answerData: any;
      id: number;
    }) => {
      return await updateAnswerToQuestion(answerData, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProductQuestions"] });
      queryClient.invalidateQueries({ queryKey: ["productQuestion", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useDeleteAnswerToQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { answerId: ID; questionId: ID }) => {
      const { answerId } = variables;
      return await deleteAnswerToQuestion(answerId);
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["productQuestion", variables.questionId],
      });
    },

    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetAllQuestions = () => {
  return useQuery({
    queryKey: ["questions", "all"],
    queryFn: getAllQuestions,
    staleTime: 1000 * 60 * 4,
  });
};

export const useAssignQuestionsToProduct = (
  questionId: number,
    productId: number,
  options?: any
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return await assignQuestionsToProduct(questionId, data);
    },

    onSuccess: (data, variables, context) => {
      // internal success logic
      queryClient.invalidateQueries({
        queryKey: ["productQuestion", questionId],
      });

      queryClient.refetchQueries(["product", productId]);

      queryClient.invalidateQueries({ queryKey: ["product", productId] });

      // external success (from component)
      options?.onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      // internal error logic
      console.error(error);

      // external error (from component)
      options?.onError?.(error, variables, context);
    },
  });
};

export const useUnassignQuestionsFromProduct = (
  questionId: number,
  options?: any
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return await unassignQuestionsFromProduct(questionId, data);
    },
    onSuccess: (data, variables, context) => {
      // internal success logic
      queryClient.invalidateQueries({
        queryKey: ["productQuestion", questionId],
      });
      // external success (from component)
      options?.onSuccess?.(data, variables, context);
    }
    ,
    onError: (error, variables, context) => {
      // internal error logic
      console.error(error);
      // external error (from component)
      options?.onError?.(error, variables, context);
    },
  });
}
