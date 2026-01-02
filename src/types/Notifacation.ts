export interface NotificationItem {
  id: string;
  notifiable_type: string;
  notifiable_id: number;
  title_ar: string;
  title_en: string;
  message_ar: string;
  message_en: string;
  type: string;
  data_id: number;
  is_read: number;
  data: any;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedNotificationsResponse {
  success: boolean;
  message: string;
  data: {
    data: NotificationItem[];
    current_page: number;
    last_page: number;
    total: number;
  };
}
