import { useQuery } from "@tanstack/react-query";
import { AdminHomeData } from "../../../../api/AdminApi/homeApi/_requests";

export const useAdminHome = () => {
  return useQuery({
    queryKey: ["adminHome"],
    queryFn: AdminHomeData,
    staleTime: 1000 * 60 * 5,
  });
};
