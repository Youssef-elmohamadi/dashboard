import { useQuery } from "@tanstack/react-query";
import { SuperAdminHomeData } from "../../../../api/SuperAdminApi/homeApi/_requests";

export const useSuperAdminHome = () => {
  return useQuery({
    queryKey: ["superAdminHome"],
    queryFn: SuperAdminHomeData,
    staleTime: 1000 * 60 * 5,
  });
};
