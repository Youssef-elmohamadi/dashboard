import axiosJson from "../../axiosInstanceJson";

export const getAllNotifications = async (page: number) => {
  return await axiosJson.get("/api/notifications", { params: { page } });
};

export const deleteNotification = async (id: number) => {
  return await axiosJson.delete(`/api/notifications/delete/${id}`);
};

export const markAsRead = async (id: number) => {
  return await axiosJson.get(`/api/notifications/mark_as_read/${id}`);
};

export const markAllAsRead = async () => {
  return await axiosJson.get("/api/notifications/mark_all_as_read");
};
