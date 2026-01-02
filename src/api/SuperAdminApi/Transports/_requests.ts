import axiosJson from "../../superAdminAxiosInstanceJson";
import axiosForm from "../../superAdminAxiosInstanceFormData";
import {  TransportationPriceParams } from "../../../types/transports";
export const getAllTransportationPrices = async () => {
  return await axiosJson.get("/api/superAdmin/transportationPrices");
};

export const getTransportationPricesPaginate = async (params: TransportationPriceParams) => {
  return await axiosJson.get("/api/superAdmin/transportationPrices/withPaginate", {
    params,
  });
};

export const getTransportationPriceById = async (id: number | string) => {
  return await axiosJson.get(`/api/superAdmin/transportationPrices/${id}`);
};

export const deleteTransportationPrice = async (id: number | string) => {
  return await axiosJson.delete(`/api/superAdmin/transportationPrices/${id}`);
};

export const createTransportationPrice = async (transportData: FormData) => {
  return await axiosForm.post(`/api/superAdmin/transportationPrices`, transportData);
};

export const updateTransportationPrice = async (
  transportData: FormData,
  id: number | string
) => {
  return await axiosForm.post(`/api/superAdmin/transportationPrices/${id}`, transportData);
};
