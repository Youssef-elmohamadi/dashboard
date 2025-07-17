import { useEffect, useState } from "react";
import EcommerceMetrics from "../../../components/common/Home/EcommerceMetrics";
import { GroupIcon, BoxIconLine } from "../../../icons";
import FilterRangeDate from "../../../components/admin/reports/FilterRangeDate";
import { useTranslation } from "react-i18next";
import PageMeta from "../../../components/common/SEO/PageMeta";
import { useOrderData } from "../../../hooks/Api/Admin/useOrdersReports/useOrdersReport";
import SEO from "../../../components/common/SEO/seo";

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
        setUnauthorized(t("OrdersReports:unauthorized"));
      } else {
        setGeneralError(t("OrdersReports:somethingWentWrong"));
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
        />
        <p className="text-center mt-5">{t("OrdersReports:loading")}</p>
      </>
    );
  }

  if (unauthorized) {
    return (
      <>
        <SEO
          title={{
            ar: "تشطيبة - تقارير الطلبات - غير مصرح",
            en: "Tashtiba - Orders Reports - Unauthorized",
          }}
          description={{
            ar: "لا يوجد تصريح للوصول إلى صفحة تقارير الطلبات في تشطيبة. يرجى تسجيل الدخول بحساب مسؤول.",
            en: "Unauthorized access to Tashtiba order reports. Please log in with an administrator account.",
          }}
          keywords={{
            ar: ["تقارير الطلبات", "تشطيبة", "غير مصرح", "إدارة", "سجل الدخول"],
            en: ["order reports", "Tashtiba", "unauthorized", "admin", "login"],
          }}
        />
        <p className="text-center text-red-500 mt-5">{unauthorized}</p>
      </>
    );
  }

  if (generalError) {
    return (
      <>
        <SEO
          title={{
            ar: "تشطيبة - تقارير الطلبات - خطأ",
            en: "Tashtiba - Orders Reports - Error",
          }}
          description={{
            ar: "حدث خطأ أثناء تحميل تقارير الطلبات في تشطيبة. يرجى المحاولة مرة أخرى.",
            en: "An error occurred while loading Tashtiba order reports. Please try again.",
          }}
          keywords={{
            ar: ["تقارير الطلبات", "تشطيبة", "خطأ", "مشكلة", "إدارة"],
            en: ["order reports", "Tashtiba", "error", "issue", "admin"],
          }}
        />
        <p className="text-center text-red-500 mt-5">{generalError}</p>
      </>
    );
  }

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
      />
      <FilterRangeDate setSearchParam={handleFilter} />
      <div className="col-span-6 space-y-6 ">
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
    </>
  );
};

export default OrdersReport;
