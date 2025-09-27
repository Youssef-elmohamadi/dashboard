import { ar } from "date-fns/locale";
import {
  createArticle,
  getArticleById,
  updateArticle,
} from "./../../../../api/SuperAdminApi/Articles/_requests";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteArticle,
  getArticlesPaginate,
} from "../../../../api/SuperAdminApi/Articles/_requests";

export const useArticlesWithPaginate = (page: number, filters?: any) => {
  return useQuery<any>({
    queryKey: ["articles", page, filters],
    queryFn: async () => {
      const response = await getArticlesPaginate({
        page: page + 1,
        ...filters,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await deleteArticle(id);
      return res;
    },
    onSuccess: (_, variables) => {
      const id = variables;
      queryClient.invalidateQueries({ queryKey: ["Articles"] });
      queryClient.invalidateQueries({ queryKey: ["Article", id] });
      queryClient.invalidateQueries({ queryKey: ["articles", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (articleData: any) => {
      return await createArticle(articleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useGetArticleById = (id?: number | string) => {
  return useQuery<any>({
    queryKey: ["article", id],
    queryFn: async () => {
      const response = await getArticleById(id!);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
};

export const useUpdateArticle = (id: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ articleData, id }: { id: number; articleData: any }) => {
      return await updateArticle(articleData, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["article", id] });
      queryClient.invalidateQueries({ queryKey: ["articles", "all"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

