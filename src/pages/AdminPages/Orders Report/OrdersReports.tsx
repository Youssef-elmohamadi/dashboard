import { useEffect, useState } from "react";
import EcommerceMetrics from "../../../components/common/Home/EcommerceMetrics";
import { GroupIcon, BoxIconLine } from "../../../icons";
import FilterRangeDate from "../../../components/admin/reports/FilterRangeDate";
import { useTranslation } from "react-i18next";
import PageMeta from "../../../components/common/SEO/PageMeta";
import { useOrderData } from "../../../hooks/Api/Admin/useOrdersReports/useOrdersReport";

type numbersData = {
  orderCount: number;
  deliveredOrdersCount: number;
  cancelledOrdersCount: number;
  totalItemsSold: number;
  averageOrderValue: number;
};

const OrdersReport = () => {
  const [numbersData, setNumbersData] = useState<numbersData>({
    orderCount: 0,
    deliveredOrdersCount: 0,
    cancelledOrdersCount: 0,
    totalItemsSold: 0,
    averageOrderValue: 0,
  });

  const [searchValues, setSearchValues] = useState({
    start_date: "",
    end_date: "",
  });

  const [generalError, setGeneralError] = useState("");
  const [unauthorized, setUnauthorized] = useState("");

  const { data, isLoading, isError, error } = useOrderData(searchValues);
  const ordersReportsData = data;

  const { t } = useTranslation(["OrdersReports"]);

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

  useEffect(() => {
    if (isError && error) {
      const err = error as any;
      if (err?.response?.status === 401) {
        setUnauthorized(t("unauthorized"));
      } else {
        setGeneralError(t("somethingWentWrong"));
      }
    }
  }, [isError, error, t]);

  const handleFilter = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (isLoading) {
    return (
      <>
        <PageMeta
          title={t("mainTitle")}
          description="Show Your Orders Reports"
        />
        <p className="text-center mt-5">{t("loading")}</p>
      </>
    );
  }

  if (unauthorized) {
    return (
      <>
        <PageMeta
          title={t("mainTitle")}
          description="Show Your Orders Reports"
        />
        <p className="text-center text-red-500 mt-5">{unauthorized}</p>
      </>
    );
  }

  if (generalError) {
    return (
      <>
        <PageMeta
          title={t("mainTitle")}
          description="Show Your Orders Reports"
        />
        <p className="text-center text-red-500 mt-5">{generalError}</p>
      </>
    );
  }

  return (
    <>
      <PageMeta title={t("mainTitle")} description="Show Your Orders Reports" />
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
              value: Number(numbersData.averageOrderValue).toFixed(2),
              percentage: -9.05,
              icon: BoxIconLine,
            },
          ]}
        />
      </div>
    </>
  );
};

export default OrdersReport;
