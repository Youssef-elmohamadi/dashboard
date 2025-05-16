import axiosInstanceEndUser from "../../userAxiosInstanceEndUser";

export const getHome = async () => {
    return await axiosInstanceEndUser.get("/api/user/home");
};