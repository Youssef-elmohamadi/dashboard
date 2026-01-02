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
  read_at: string | null;
  created_at: string;
  updated_at: string;
}
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationData {
  current_page: number;
  data: NotificationItem[]; // The array of notification items
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
export interface NotificationApiResponse {
  success: boolean;
  message: string;
  data: PaginationData; // The main 'data' field now holds the pagination object
}

export interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  notificationIconRef: React.RefObject<HTMLDivElement | null>;
}