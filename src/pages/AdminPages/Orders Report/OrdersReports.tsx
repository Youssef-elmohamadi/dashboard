import { useEffect, useState } from "react";
import EcommerceMetrics from "../../../components/ecommerce/EcommerceMetrics";
import { GroupIcon } from "../../../icons";
import { BoxIconLine } from "../../../icons";
import FilterRangeDate from "../../../components/admin/productReports/FilterRangeDate";
import { ordersReport } from "../../../api/AdminApi/ordersReports/_requests";
import { useTranslation } from "react-i18next";
import PageMeta from "../../../components/common/PageMeta";
import { useOrderData } from "../../../hooks/useOrdersReport";
const ProductReports = () => {
  const [numbersData, setNumbersData] = useState({
    orderCount: 0,
    deliveredOrdersCount: 0,
    cancelledOrdersCount: 0,
    totalItemsSold: 0,
    averageOrderValue: 0,
  });

  const [searchValues, setSearchValues] = useState<{
    start_date: string;
    end_date: string;
  }>({
    start_date: "",
    end_date: "",
  });
  const { data, isLoading, isError, error } = useOrderData(searchValues);

  const ordersReportsData = data;
  useEffect(() => {
    if (ordersReportsData) {
      setNumbersData({
        orderCount: ordersReportsData.orderCount,
        deliveredOrdersCount: ordersReportsData.deliveredOrdersCount,
        cancelledOrdersCount: ordersReportsData.cancelledOrdersCount,
        totalItemsSold: ordersReportsData.totalItemsSold,
        averageOrderValue: ordersReportsData.averageOrderValue,
      });
    }
  }, [ordersReportsData]);

  const { t } = useTranslation(["OrdersReports"]);

  const handleFilter = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return (
    <>
      <PageMeta
        title="Tashtiba | Orders Reports"
        description="Show Your Orders Reports"
      />
      <FilterRangeDate setSearchParam={handleFilter} />
      <div className="col-span-6 space-y-6 ">
        <EcommerceMetrics
          parentClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6"
          metrics={[
            {
              label: t("ordersCount"),
              value: numbersData.orderCount,
              percentage: 11.01,
              icon: GroupIcon,
            },
            {
              label: t("deliveredOrdersCount"),
              value: numbersData.deliveredOrdersCount,
              percentage: -9.05,
              icon: BoxIconLine,
            },
            {
              label: t("cancelledOrdersCount"),
              value: numbersData.totalItemsSold,
              percentage: -9.05,
              icon: BoxIconLine,
            },
            {
              label: t("totalItemsSold"),
              value: numbersData.cancelledOrdersCount,
              percentage: -9.05,
              icon: BoxIconLine,
            },
            {
              label: t("averageOrderValue"),
              value: numbersData.averageOrderValue.toFixed(2),
              percentage: -9.05,
              icon: BoxIconLine,
            },
          ]}
        />
      </div>
    </>
  );
};

export default ProductReports;
