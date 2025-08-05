import { useEffect, useState } from "react";
import EcommerceMetrics from "../../../components/common/Home/EcommerceMetrics";
import { GroupIcon, BoxIconLine } from "../../../icons";
import FilterRangeDate from "../../../components/admin/reports/FilterRangeDate";
import { useTranslation } from "react-i18next";
import { useOrderData } from "../../../hooks/Api/Admin/useOrdersReports/useOrdersReport";
import SEO from "../../../components/common/SEO/seo";
import PageStatusHandler, {
  PageStatus,
} from "../../../components/common/PageStatusHandler/PageStatusHandler";
import { AxiosError } from "axios";

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

  const { t } = useTranslation(["OrdersReports"]);

  const {
    data: ordersReportsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useOrderData(searchValues);

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

  const handleFilter = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getPageStatus = () => {
    if (isLoading) return PageStatus.LOADING;
    if (isError) return PageStatus.ERROR;
    if (!ordersReportsData) return PageStatus.NOT_FOUND;
    return PageStatus.SUCCESS;
  };

  const getErrorMessage = (): string | undefined => {
    if (isError) {
      const status = (error as AxiosError)?.response?.status;
      if (status === 401) {
        return t("OrdersReports:unauthorized");
      }
      return t("OrdersReports:somethingWentWrong");
    }
    return undefined;
  };

  const handleRetry = () => {
    refetch();
  };

  const pageStatus = getPageStatus();
  const errorMessage = getErrorMessage();

  return (
    <>
      <SEO
        title={{
          ar: "تشطيبة - تقارير الطلبات والإحصائيات",
          en: "Tashtiba - Orders Reports & Analytics",
        }}
        description={{
          ar: "استعرض تقارير شاملة عن الطلبات في متجر تشطيبة، بما في ذلك عدد الطلبات، الطلبات المسلمة والملغاة، إجمالي الأصناف المباعة، ومتوسط قيمة الطلب.",
          en: "View comprehensive order reports for Tashtiba store, including order count, delivered and canceled orders, total items sold, and average order value.",
        }}
        keywords={{
          ar: [
            "تقارير الطلبات",
            "إحصائيات المبيعات",
            "إدارة الطلبات",
            "تشطيبة",
            "تقارير التجارة الإلكترونية",
            "أداء المبيعات",
            "تحليل الطلبات",
            "متابعة الطلبات",
          ],
          en: [
            "order reports",
            "sales analytics",
            "order management",
            "Tashtiba",
            "e-commerce reports",
            "sales performance",
            "order analysis",
            "order tracking",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <FilterRangeDate setSearchParam={handleFilter} />
      <PageStatusHandler
        status={pageStatus}
        loadingText={t("OrdersReports:loading")}
        errorMessage={errorMessage}
        onRetry={handleRetry}
      >
        <div className="col-span-6 space-y-6">
          <EcommerceMetrics
            parentClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6"
            metrics={[
              {
                label: t("OrdersReports:ordersCount"),
                value: numbersData.orderCount,
                percentage: 11.01,
                icon: GroupIcon,
              },
              {
                label: t("OrdersReports:deliveredOrdersCount"),
                value: numbersData.deliveredOrdersCount,
                percentage: -9.05,
                icon: BoxIconLine,
              },
              {
                label: t("OrdersReports:cancelledOrdersCount"),
                value: numbersData.cancelledOrdersCount,
                percentage: -9.05,
                icon: BoxIconLine,
              },
              {
                label: t("OrdersReports:totalItemsSold"),
                value: numbersData.totalItemsSold,
                percentage: -9.05,
                icon: BoxIconLine,
              },
              {
                label: t("OrdersReports:averageOrderValue"),
                value: Number(numbersData.averageOrderValue).toFixed(2),
                percentage: -9.05,
                icon: BoxIconLine,
              },
            ]}
          />
        </div>
      </PageStatusHandler>
    </>
  );
};

export default OrdersReport;
