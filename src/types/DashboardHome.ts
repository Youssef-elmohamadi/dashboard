import { Order } from "./Orders";
export interface CountType {
  all: number;
  active: number;
  inactive: number;
}

export type NumbersData = {
  customersCount: number;
  ordersCount: number;
  vendorsCount?: CountType;
  productsCount?: CountType;
};

export interface HomeData {
  customer_count: number;
  order_count: number;
  vendor_count?: CountType;
  product_count?: CountType;
  order_count_per_month?: { month: string; count: number }[];
  recent_orders?: Order[];
}
export interface StatisticsChartProps {
  ordersData: {
    orderPerMonth: Record<string, number>;
  };
}

export interface RecentOrdersProps {
  orders: Order[];
  userType: "admin" | "super_admin";
}

export interface CountryMapProps {
  mapColor?: string;
}
export type MetricValue =
  | number
  | string
  | Record<string, number | string>
  | CountType;

export interface EcommerceMetricsProps {
  metrics?: Metric[];
  parentClassName?: string;
}
export type Metric = {
  label?: string;
  value?: MetricValue;
  percentage: number;
  icon?: React.ElementType;
  iconClassName?: string;
};

export interface MonthlySales {
  orderPerMonth: Record<string, number>;
}

export interface HomeProps {
  userType: "admin" | "super_admin";
}
