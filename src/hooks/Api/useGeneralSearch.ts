import { useQuery } from "@tanstack/react-query";
import { generalSearch } from "../../api/Search/_request";

export const useGeneralSearch = (keyword: string, userType: string) => {
  return useQuery({
    queryKey: ["generalSearch", keyword, userType],
    queryFn: () => generalSearch(keyword, userType),
    enabled: !!keyword && !!userType,
    staleTime: 1000 * 60 * 5,
  });
};
