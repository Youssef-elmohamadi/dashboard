import { useQuery } from "@tanstack/react-query";
import {
  getBlogs,
  getBlogById,
} from "../../../../api/EndUserApi/endUserBlogs/requests";

export const useBlogs = (page: number) => {
  return useQuery({
    queryKey: ["blogs", page],
    queryFn: () => getBlogs(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useBlog = (id: string) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id),
  });
};
