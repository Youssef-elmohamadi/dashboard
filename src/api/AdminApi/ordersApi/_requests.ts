import { ID } from "../../../types/Common";
import axiosJson from "../../axiosInstanceJson";
import {
  GetOrdersPaginateApiResponse,
  OrdersParams,
} from "./../../../types/Orders";
export const getOrdersWithPaginate = async (params: OrdersParams) => {
  return await axiosJson.get<GetOrdersPaginateApiResponse>(
    "/api/vendor/orders/withPaginate",
    {
      params,
    }
  );
};
export const getOrderById = async (id: number | string) => {
  return await axiosJson.get(`/api/vendor/orders/${id}`);
};

export const cancelOrder = async (id:ID) => {
  return await axiosJson.get(`/api/vendor/orders/cancel/${id}`);
};
