import EcommerceMetrics from "../../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../../components/ecommerce/StatisticsChart";
import RecentOrders from "../../../components/ecommerce/RecentOrders";
import DemographicCard from "../../../components/ecommerce/DemographicCard";
import PageMeta from "../../../components/common/PageMeta";
import { useEffect, useState } from "react";
import { GroupIcon } from "../../../icons";
import { BoxIconLine } from "../../../icons";
import { useTranslation } from "react-i18next";
import { useAdminHome } from "../../../hooks/Api/Admin/useHome/useAdminHome";
import { useSuperAdminHome } from "../../../hooks/Api/SuperAdmin/useHome/useSuperAdminHome";
import DashboardSkeleton from "../../../components/admin/home/HomeSkeleton";

type MetricValue =
  | number
  | string
  | Record<string, number | string>
  | CountType;
type Metric = {
  label?: string;
  value?: MetricValue;
  percentage: number;
  icon?: React.ElementType;
  iconClassName?: string;
};
interface Vendor {
  name: string;
}
interface Order {
  id: string | number;
  vendor?: Vendor;
  total: number;
  status: string;
  shipping_status: string;
  estimated_delivery_date: string;
  delivered_at: string;
  total_amount: string;
}

interface MonthlySales {
  orderPerMonth: { month: string; count: number }[];
}

interface CountType {
  all: number;
  active: number;
  inactive: number;
}

interface HomeData {
  customer_count: number;
  order_count: number;
  vendor_count?: CountType;
  product_count?: CountType;
  order_count_per_month?: { month: string; count: number }[];
  recent_orders?: Order[];
}

interface HomeProps {
  userType: "admin" | "super_admin";
}

export default function Home({ userType }: HomeProps) {
  const { t } = useTranslation(["Home"]);

  const [numbersData, setNumbersData] = useState<{
    customersCount: number;
    ordersCount: number;
    vendorsCount?: CountType;
    productsCount?: CountType;
  }>({
    customersCount: 0,
    ordersCount: 0,
    vendorsCount: { all: 0, active: 0, inactive: 0 },
    productsCount: { all: 0, active: 0, inactive: 0 },
  });

  const [monthlySalesData, setMonthlySalesData] = useState<MonthlySales>({
    orderPerMonth: [],
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const { data, isLoading: loading } =
    userType === "admin" ? useAdminHome() : useSuperAdminHome();

  const homeData: HomeData | undefined =
    userType === "admin" ? data?.data.data[0] : data?.data.data;

  useEffect(() => {
    if (!homeData) return;

    setNumbersData({
      customersCount: homeData.customer_count || 0,
      ordersCount: homeData.order_count || 0,
      vendorsCount: homeData.vendor_count,
      productsCount: homeData.product_count,
    });

    setMonthlySalesData({
      orderPerMonth: homeData.order_count_per_month || [],
    });

    setRecentOrders(homeData.recent_orders || []);
  }, [homeData]);

  const metrics: Metric[] =
    userType === "admin"
      ? [
          {
            label: t("customers"),
            value: numbersData.customersCount,
            percentage: 11.01,
            icon: GroupIcon,
          },
          {
            label: t("orders"),
            value: numbersData.ordersCount,
            percentage: -9.05,
            icon: BoxIconLine,
          },
        ]
      : [
          {
            label: t("customers"),
            value: numbersData.customersCount,
            percentage: 11.01,
            icon: GroupIcon,
          },
          {
            label: t("orders"),
            value: numbersData.ordersCount,
            percentage: -9.05,
            icon: BoxIconLine,
          },
          {
            label: t("vendors"),
            value: numbersData.vendorsCount,
            percentage: 3.1,
            icon: BoxIconLine,
          },
          {
            label: t("products"),
            value: numbersData.productsCount,
            percentage: 7.2,
            icon: BoxIconLine,
          },
        ];

  if (loading) {
    return (
      <>
        <PageMeta
          title="Tashtiba | Home Admin Dashboard"
          description="Show Your Statistics"
        />
        <DashboardSkeleton />
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Tashtiba | Home Admin Dashboard"
        description="Show Your Statistics"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics
            parentClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6"
            metrics={metrics}
          />
          <MonthlySalesChart OrdersData={monthlySalesData} />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12">
          <StatisticsChart ordersData={monthlySalesData} />
        </div>

        <div className="col-span-12">
          <RecentOrders orders={recentOrders} userType={userType} />
        </div>
      </div>
    </>
  );
}
