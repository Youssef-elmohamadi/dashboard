export interface Notification {
  id: number;
  data_id: number | string;
  created_at: string;
  title_en: string;
  title_ar: string;
  message_en: string;
  message_ar: string;
}

export  interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  notificationIconRef: React.RefObject<HTMLDivElement | null>;
}

export interface NotificationItem {
  id: string;
  notifiable_type: string;
  notifiable_id: number;
  title_ar: string;
  title_en: string;
  message_ar: string;
  message_en: string;
  type: string;
  data_id: number | string;
  is_read: number;
  data: any;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  notificationIconRef: React.RefObject<HTMLDivElement | null>;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: NotificationItem[];
}