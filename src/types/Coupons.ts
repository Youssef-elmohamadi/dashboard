export interface CouponRequest {
  code: string;
  order_total: number;
}
export interface CouponResponse {
  discount: number;
  message: string;
}
