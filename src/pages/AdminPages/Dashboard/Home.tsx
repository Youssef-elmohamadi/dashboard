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
import { AxiosError } from "axios";
import { Order } from "../../../types/Orders";
import { CountType, HomeData, HomeProps, Metric, MonthlySales, NumbersData } from "../../../types/DashboardHome";
export default function Home({ userType }: HomeProps) {
  const { t } = useTranslation(["Home"]);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [numbersData, setNumbersData] = useState<NumbersData>({
    customersCount: 0,
    ordersCount: 0,
    vendorsCount: { all: 0, active: 0, inactive: 0 },
    productsCount: { all: 0, active: 0, inactive: 0 },
  });

  const [monthlySalesData, setMonthlySalesData] = useState<MonthlySales>({
    orderPerMonth: {},
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const {
    data,
    isLoading: loading,
    error,
    isError,
  } = userType === "admin" ? useAdminHome() : useSuperAdminHome();

  const homeData: HomeData | undefined =
    userType === "admin" ? data?.data.data[0] : data?.data.data;
  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setUnauthorized(true);
      } else if (status === 500) {
        setGlobalError(true);
      } else {
        setGlobalError(true);
      }
    }
  }, [isError, error]);
  useEffect(() => {
    if (!homeData) return;

    setNumbersData({
      customersCount: homeData.customer_count || 0,
      ordersCount: homeData.order_count || 0,
      vendorsCount: homeData.vendor_count,
      productsCount: homeData.product_count,
    });

    let orderPerMonthRecord: Record<string, number> = {};

    if (Array.isArray(homeData.order_count_per_month)) {
      homeData.order_count_per_month.forEach(({ month, count }) => {
        orderPerMonthRecord[month] = count;
      });
    } else if (
      typeof homeData.order_count_per_month === "object" &&
      homeData.order_count_per_month !== null
    ) {
      orderPerMonthRecord = homeData.order_count_per_month as Record<
        string,
        number
      >;
    }

    setMonthlySalesData({
      orderPerMonth: orderPerMonthRecord,
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
        <PageMeta title={t("mainTitle")} description="Show Your Statistics" />
        <DashboardSkeleton />
      </>
    );
  }

  return (
    <>
      <PageMeta title={t("mainTitle")} description="Show Your Statistics" />

      {!loading && globalError && (
      <div className="p-4 text-center text-red-500 font-semibold">
        {t("unExpectedError")}
      </div>
      )}

      {!loading && unauthorized && (
      <div className="p-4 text-center text-red-500 font-semibold">
        {t("unauthorized")}
      </div>
      )}

      <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics
        parentClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6"
        metrics={metrics}
        />
        <MonthlySalesChart ordersData={monthlySalesData} />
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
