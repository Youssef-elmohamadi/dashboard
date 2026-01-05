import { useMutation } from "@tanstack/react-query";
import { createRequestQuotation } from "../../../../api/EndUserApi/quotationApi/request";

export const useCreateRequest = () => {
  return useMutation({
    mutationFn: async (requestData: any) => {
      return await createRequestQuotation(requestData);
    },
  });
};
