export type TableAlert = {
  variant: "success" | "error" | "warning" | "info";
  message: string;
  title: string;
};

export type ID = {
  id: number | string | undefined;
};

export type ImageObject = {
  id: number;
  image: string;
};

export type Review = {
  id: number;
  rating: number;
  review: string;
  comment: string;
  user_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
};
