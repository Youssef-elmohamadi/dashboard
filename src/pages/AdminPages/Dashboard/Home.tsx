import EcommerceMetrics from "../../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../../components/ecommerce/StatisticsChart";
import RecentOrders from "../../../components/ecommerce/RecentOrders";
import DemographicCard from "../../../components/ecommerce/DemographicCard";
import PageMeta from "../../../components/common/PageMeta";
import { useEffect, useState } from "react";
import { AdminHomeData } from "../../../api/AdminApi/homeApi/_requests";
import { GroupIcon } from "../../../icons";
import { BoxIconLine } from "../../../icons";
import { useTranslation } from "react-i18next";
import { useAdminHome } from "../../../hooks/useAdminHome";

interface Product {
  name: string;
}
interface Items {
  product: Product[];
}
interface Order {
  items: Items[];
}
export default function Home() {
  const { t } = useTranslation(["Home"]);
  const [numbersData, setNumbersData] = useState({
    customerCount: 0,
    ordersCount: 0,
  });
  const [monthlySalesData, setMonthlySalesData] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const { data } = useAdminHome();
  console.log(data?.data.data[0]);
  const homeData = data?.data.data[0];
  useEffect(() => {
    setNumbersData({
      customerCount: homeData?.customer_count,
      ordersCount: homeData?.order_count,
    });

    setMonthlySalesData({
      orderPerMonth: homeData?.order_count_per_month,
    });
    const mappedOrders = homeData.recent_orders.map((order: Order) => {
      const firstItem = order.items[0]?.product;
      return {
        productName: firstItem?.name || "N/A",
        productImage:
          firstItem?.images?.[0]?.image || "/images/product/product-01.jpg", // إذا كان هناك صور
        productCategory: firstItem?.category_id || "N/A",
        productPrice: firstItem?.price || 0,
        productStatus: order.status || "N/A",
      };
    });
    setRecentOrders(mappedOrders);
  }, [homeData]);

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
            metrics={[
              {
                label: t("customers"),
                value: numbersData.customerCount,
                percentage: 11.01,
                icon: GroupIcon,
              },
              {
                label: t("orders"),
                value: numbersData.ordersCount,
                percentage: -9.05,
                icon: BoxIconLine,
              },
            ]}
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
          <RecentOrders orders={recentOrders} />
        </div>
      </div>
    </>
  );
}
