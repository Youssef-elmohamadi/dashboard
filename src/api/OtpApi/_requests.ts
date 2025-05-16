import axiosJson from "../userAxiosInstanceEndUser";

export const sendOtp = async (data: any) => {
  return await axiosJson.post("/api/general/send_otp_code", data);
};

export const verifyOtp = async (data: any) => {
  return await axiosJson.post("/api/general/verify_otp_code", data);
};

export const resetPassword = async (data: any) => {
  return await axiosJson.post("/api/general/reset_password", data);
};
