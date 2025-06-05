import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../../../api/EndUserApi/endUserAuth/_requests";

export const useProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const res = await getProfile();
            return res.data.data;
        },
        staleTime: 1000 * 60 * 5,
    });
};